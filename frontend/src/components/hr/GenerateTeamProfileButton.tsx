import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { api } from '../../api/client';
import { formatApiError } from '../../utils/errors';
import { Button } from '../ui/Button';

export function GenerateTeamProfileButton({
  companyName,
  websiteUrl,
  onGenerated,
  onError,
  disabled,
}: {
  companyName: string;
  websiteUrl: string;
  onGenerated: (result: { teamProfile: string; websiteUrl: string }) => void;
  onError: (message: string) => void;
  disabled?: boolean;
}) {
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    if (!companyName.trim() || !websiteUrl.trim()) {
      onError('Enter company name and website URL first.');
      return;
    }
    setGenerating(true);
    try {
      const res = await api.post<{
        teamProfile: string;
        websiteUrl: string;
        sources: string[];
      }>('/auth/generate-team-profile-from-website', {
        companyName: companyName.trim(),
        websiteUrl: websiteUrl.trim(),
      });
      onGenerated({
        teamProfile: res.teamProfile,
        websiteUrl: res.websiteUrl,
      });
    } catch (e) {
      onError(formatApiError(e, 'Generate from website'));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={generate}
      disabled={
        disabled || generating || !companyName.trim() || !websiteUrl.trim()
      }
    >
      <Sparkles className="h-4 w-4" />
      {generating ? 'Reading website…' : 'Generate from website'}
    </Button>
  );
}
