import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Check, Sparkles, Wand2 } from 'lucide-react';
import { api } from '../../api/client';
import type { JobPosting, ListingIssue, ProfileFieldKey } from '../../api/types';
import { ProfileRequirementsEditor } from '../../components/hr/ProfileRequirementsEditor';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { wordCount, statusLabel } from '../../utils/format';
import { formatApiError } from '../../utils/errors';
import { JobDescriptionEditor } from '../../components/hr/JobDescriptionEditor';
import { JobPostingActions } from '../../components/hr/JobPostingActions';
import { TextDiff } from '../../components/hr/TextDiff';

const TITLE_PLACEHOLDER = 'e.g. Junior WordPress Developer';

export function JobEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jobId, setJobId] = useState<string | null>(isNew ? null : id ?? null);
  const [checked, setChecked] = useState(false);
  const [issues, setIssues] = useState<ListingIssue[]>([]);
  const [skills, setSkills] = useState<JobPosting['skillRequirements']>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(
    () => (location.state as { wizardSuccess?: string } | null)?.wizardSuccess ?? '',
  );
  const [busy, setBusy] = useState('');
  const [appliedDiff, setAppliedDiff] = useState<{
    before: string;
    after: string;
  } | null>(null);
  const [suggestionsApplied, setSuggestionsApplied] = useState(false);
  const [requiredProfileFields, setRequiredProfileFields] = useState<
    ProfileFieldKey[]
  >([]);

  const { data: job } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => api.get<JobPosting>(`/jobs/${jobId}`),
    enabled: !!jobId && !isNew,
  });

  useEffect(() => {
    if (job) {
      setTitle(job.title);
      setDescription(job.description);
      setSkills(job.skillRequirements ?? []);
      if (job.status === 'ANALYZED' || job.status === 'PUBLISHED') {
        setChecked(true);
        const analysis = job.listingAnalyses?.[0];
        if (analysis?.issues) setIssues(analysis.issues as ListingIssue[]);
      }
      setSuggestionsApplied(!!job.suggestionsAppliedAt);
      setRequiredProfileFields(job.requiredProfileFields ?? []);
    }
  }, [job]);

  const saveDraft = useCallback(async () => {
    setError('');
    setBusy('save');
    try {
      if (!jobId) {
        const created = await api.post<JobPosting>('/jobs', {
          title,
          description,
          requiredProfileFields,
        });
        setJobId(created.id);
        navigate(`/hr/jobs/${created.id}`, { replace: true });
      } else {
        await api.patch(`/jobs/${jobId}`, {
          title,
          description,
          requiredProfileFields,
        });
      }
      setSuccess('Draft saved');
      queryClient.invalidateQueries({ queryKey: ['hr', 'jobs'] });
    } catch (e) {
      setError(formatApiError(e, 'Save draft'));
    } finally {
      setBusy('');
    }
  }, [jobId, title, description, requiredProfileFields, navigate, queryClient]);

  const hasContent = title.trim().length > 0 && description.trim().length > 0;

  const checkListing = async () => {
    if (!hasContent) {
      setError('Add a job title and description before running Check listing.');
      return;
    }
    setError('');
    setSuccess('');
    setBusy('check');
    try {
      let idToUse = jobId;
      if (!idToUse) {
        const created = await api.post<JobPosting>('/jobs', {
          title,
          description,
          requiredProfileFields,
        });
        idToUse = created.id;
        setJobId(created.id);
        navigate(`/hr/jobs/${created.id}`, { replace: true });
      } else {
        await api.patch(`/jobs/${idToUse}`, { title, description });
      }
      const updated = await api.post<JobPosting>(
        `/jobs/${idToUse}/check-listing`,
      );
      setChecked(true);
      setSuggestionsApplied(false);
      setAppliedDiff(null);
      setSkills(updated.skillRequirements ?? []);
      const analysis = updated.listingAnalyses?.[0];
      const foundIssues = (analysis?.issues as ListingIssue[]) ?? [];
      setIssues(foundIssues);
      setSuccess(
        foundIssues.length === 0
          ? 'Listing looks good — no major issues. You can publish when ready.'
          : `Found ${foundIssues.length} issue${foundIssues.length === 1 ? '' : 's'} to review`,
      );
      queryClient.invalidateQueries({ queryKey: ['job', idToUse] });
    } catch (e) {
      setError(formatApiError(e, 'AI listing check'));
    } finally {
      setBusy('');
    }
  };

  const applySuggestions = async () => {
    if (!jobId) return;
    setError('');
    setBusy('apply');
    const before = description;
    try {
      await api.post(`/jobs/${jobId}/accept-suggestions`);
      const updated = await api.post<JobPosting>(
        `/jobs/${jobId}/apply-suggestions`,
      );
      setDescription(updated.description);
      setAppliedDiff({ before, after: updated.description });
      setSuggestionsApplied(true);
      setSuccess('Suggestions applied — review the changes below');
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
    } catch (e) {
      setError(formatApiError(e, 'Apply suggestions'));
    } finally {
      setBusy('');
    }
  };

  const revertAppliedSuggestions = () => {
    if (!appliedDiff) return;
    setDescription(appliedDiff.before);
    setAppliedDiff(null);
    setSuggestionsApplied(false);
    setSuccess('Reverted to the previous description — you can apply suggestions again');
  };

  const publish = async () => {
    if (!jobId) return;
    setError('');
    setBusy('publish');
    try {
      await api.post(`/jobs/${jobId}/publish`);
      setSuccess('Listing published · Assessment generated');
      queryClient.invalidateQueries({ queryKey: ['hr', 'jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
    } catch (e) {
      setError(formatApiError(e, 'Publish listing'));
    } finally {
      setBusy('');
    }
  };

  const severityStyle = (s: string) => {
    if (s === 'high') return 'border-l-4 border-l-amber-500 bg-amber-50';
    if (s === 'medium') return 'border-l-4 border-l-amber-400 bg-amber-50/80';
    return 'border-l-4 border-l-blue-500 bg-blue-50';
  };

  const canPublish =
    checked && (skills?.length ?? 0) > 0 && job?.status !== 'PUBLISHED';

  const canRecheckListing =
    checked &&
    hasContent &&
    job?.status !== 'PUBLISHED' &&
    job?.status !== 'CLOSED';

  const isEditable =
    isNew ||
    !job ||
    job.status === 'DRAFT' ||
    job.status === 'ANALYZED';

  const isPublished = job?.status === 'PUBLISHED';
  const isClosed = job?.status === 'CLOSED';

  return (
    <div>
      <p className="text-sm text-slate-500">
        <Link to="/hr/jobs" className="hover:text-indigo-600">
          Jobs
        </Link>{' '}
        / {isNew ? 'New posting' : isEditable ? 'Edit' : 'View'}
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">
        {isNew ? 'Create job posting' : isEditable ? 'Edit job posting' : 'Job posting'}
      </h1>
      <p className="text-sm text-slate-500">
        {title.trim() || 'Untitled posting'} ·{' '}
        {job ? statusLabel(job.status) : 'Draft'}
      </p>

      {error && (
        <div className="mt-4">
          <Alert onDismiss={() => setError('')}>{error}</Alert>
        </div>
      )}
      {success && (
        <div className="mt-4">
          <Alert variant="success" onDismiss={() => setSuccess('')}>
            {success}
          </Alert>
        </div>
      )}

      {!isEditable && (isPublished || isClosed) && (
        <div className="mt-4">
          <Alert variant="info">
            {isPublished
              ? 'This listing is published and cannot be edited. Use View results for candidates, or Archive when hiring is complete.'
              : 'This listing is archived and cannot be edited.'}
          </Alert>
        </div>
      )}

      {!checked && isEditable && (
        <Card className="mt-6 border-indigo-100 bg-indigo-50/40 p-4">
          <p className="text-sm font-medium text-indigo-900">
            Tips for a strong listing
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Use a clear job title that matches the seniority you are hiring for.</li>
            <li>
              Separate responsibilities from requirements; avoid asking juniors for
              many years of experience or senior-only stacks unless truly needed.
            </li>
            <li>
              Run <strong className="font-medium text-slate-700">Check listing</strong>{' '}
              when your draft is ready — AI will flag issues and build a skills matrix.
            </li>
            <li>
              Use the formatting toolbar for headings, bold text, and lists — candidates
              will see a clean layout, not raw markdown.
            </li>
            <li>Apply suggestions, then publish to generate the candidate assessment.</li>
          </ul>
        </Card>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className={checked ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <Card className="p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Job description
            </span>
            <input
              className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-lg font-semibold placeholder:font-normal placeholder:text-slate-400 read-only:bg-slate-50 read-only:text-slate-700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={TITLE_PLACEHOLDER}
              readOnly={!isEditable}
            />
            <JobDescriptionEditor
              value={description}
              editable={isEditable}
              onChange={(value) => {
                setDescription(value);
                if (appliedDiff && value !== appliedDiff.after) {
                  setAppliedDiff(null);
                }
              }}
            />
            <p className="mt-2 text-xs text-slate-400">
              {description.trim() ? `${wordCount(description)} words` : 'Start typing or paste your job ad'}
            </p>
          </Card>

          <Card className="mt-6 p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Candidate profile requirements
            </span>
            <p className="mt-1 text-sm text-slate-500">
              Choose which information candidates must provide on their profile before
              they can apply to this role. You will see their answers in results.
            </p>
            <div className="mt-4">
              <ProfileRequirementsEditor
                value={requiredProfileFields}
                onChange={setRequiredProfileFields}
                disabled={!isEditable}
              />
            </div>
            {isEditable && (
              <p className="mt-3 text-xs text-slate-400">
                Save draft to keep these settings. Requirements cannot be changed after
                publish.
              </p>
            )}
          </Card>

          {appliedDiff && (
            <Card className="mt-4 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Changes from AI suggestions
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Green lines were added, red lines were removed (like a pull request diff).
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={revertAppliedSuggestions}
                  >
                    Revert changes
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setAppliedDiff(null)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
              <TextDiff
                className="mt-4"
                before={appliedDiff.before}
                after={appliedDiff.after}
              />
            </Card>
          )}
        </div>

        {checked && (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span className="text-xs font-semibold uppercase text-slate-500">
                  AI analysis
                </span>
                <Badge variant="info">AI Assistant</Badge>
              </div>
              <div className="mt-4 space-y-3">
                {issues.length === 0 ? (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                    <p className="font-medium">Listing looks good</p>
                    <p className="mt-1 text-emerald-800/90">
                      No substantive issues for this seniority level. Review the skills matrix
                      below, then publish when you are ready.
                    </p>
                  </div>
                ) : (
                  issues.map((issue, i) => (
                    <div
                      key={i}
                      className={`rounded-lg p-3 text-sm ${severityStyle(issue.severity)}`}
                    >
                      <p className="font-medium text-slate-900">{issue.message}</p>
                      {issue.excerpt && (
                        <p className="mt-1 text-slate-600">"{issue.excerpt}"</p>
                      )}
                    </div>
                  ))
                )}
              </div>
              {suggestionsApplied ? (
                <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                  <Check className="h-4 w-4 shrink-0" />
                  Suggestions applied
                </div>
              ) : issues.length > 0 && isEditable ? (
                <Button
                  variant="secondary"
                  className="mt-4 w-full"
                  onClick={applySuggestions}
                  disabled={busy === 'apply'}
                >
                  <Wand2 className="h-4 w-4" />
                  {busy === 'apply' ? 'Applying…' : 'Apply suggestions'}
                </Button>
              ) : null}
              {suggestionsApplied && canRecheckListing && (
                <Button
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={checkListing}
                  disabled={busy === 'check'}
                >
                  <Sparkles className="h-4 w-4" />
                  {busy === 'check' ? 'Checking…' : 'Re-check listing'}
                </Button>
              )}
            </Card>
          </div>
        )}
      </div>

      {checked && skills && skills.length > 0 && (
        <Card className="mt-6 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <span className="text-xs font-semibold uppercase text-slate-500">
                Skills matrix
              </span>
              <p className="text-sm text-slate-500">
                Extracted from your listing. Testable skills feed the assessment.
              </p>
            </div>
            <Badge variant="info">
              {skills.filter((s) => s.testable).length} testable
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3">Skill</th>
                  <th className="px-6 py-3">Importance</th>
                  <th className="px-6 py-3">Expected level</th>
                  <th className="px-6 py-3">Testable</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((s) => (
                  <tr key={s.skillName} className="border-t border-slate-100">
                    <td className="px-6 py-3 font-medium">{s.skillName}</td>
                    <td className="px-6 py-3">
                      <Badge
                        variant={
                          s.importance?.includes('MUST') ? 'danger' : 'default'
                        }
                      >
                        {s.importance?.replace('_', ' ') ?? s.importance}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{s.expectedLevel}</td>
                    <td className="px-6 py-3">
                      {s.testable ? (
                        <span className="text-emerald-600">✓</span>
                      ) : (
                        <span className="text-slate-300">×</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
        <Link to="/hr/jobs">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex flex-wrap gap-2">
          {isEditable && (
            <Button
              variant="outline"
              onClick={saveDraft}
              disabled={!!busy}
            >
              Save draft
            </Button>
          )}
          {isEditable && (!checked || canRecheckListing) && (
            <Button
              variant={checked ? 'outline' : 'primary'}
              onClick={checkListing}
              disabled={!!busy || !hasContent}
            >
              <Sparkles className="h-4 w-4" />
              {busy === 'check'
                ? 'Checking…'
                : checked
                  ? 'Re-check listing'
                  : 'Check listing'}
            </Button>
          )}
          {canPublish && (
            <Button onClick={publish} disabled={!!busy}>
              {busy === 'publish' ? 'Publishing…' : 'Publish listing'}
            </Button>
          )}
          {job?.status === 'PUBLISHED' && jobId && (
            <Link to={`/hr/jobs/${jobId}/results`}>
              <Button variant="secondary">View results</Button>
            </Link>
          )}
          {job && jobId && (
            <JobPostingActions
              job={job}
              onError={setError}
              redirectAfterDelete
            />
          )}
        </div>
      </div>
    </div>
  );
}
