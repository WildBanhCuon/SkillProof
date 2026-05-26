export type UserRole = 'hr' | 'candidate';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  companyId?: string;
  companyName?: string;
  companyTeamProfile?: string;
  companyWebsiteUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ListingIssue {
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  excerpt?: string;
}

export interface SkillRequirement {
  skillName: string;
  importance: string;
  expectedLevel: string;
  testable: boolean;
}

export type ProfileFieldKey =
  | 'displayName'
  | 'bio'
  | 'phone'
  | 'linkedInUrl'
  | 'portfolioUrl'
  | 'githubUrl'
  | 'websiteUrl'
  | 'resumeUrl';

export interface CandidateProfileData {
  displayName: string;
  bio: string | null;
  phoneCountryCode: string | null;
  phone: string | null;
  phoneFormatted?: string | null;
  linkedInUrl: string | null;
  portfolioUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  resumeUrl: string | null;
}

export interface PublishedJobsListResponse {
  items: JobPosting[];
  companies: string[];
  total: number;
}

export interface JobPosting {
  id: string;
  title: string;
  description: string;
  status: string;
  publishedAt?: string;
  company?: { name: string };
  requiredProfileFields?: ProfileFieldKey[];
  missingProfileFields?: ProfileFieldKey[];
  skillRequirements?: SkillRequirement[];
  listingAnalyses?: { issues: ListingIssue[] }[];
  suggestedDescription?: string;
  suggestionsAppliedAt?: string;
  assessment?: {
    id: string;
    durationMinutes: number;
    totalPoints?: number;
    questionCount?: number;
    questions?: { id: string }[];
  };
}

export interface McqOption {
  id: string;
  label: string;
}

export interface SessionQuestion {
  id: string;
  orderIndex: number;
  title: string;
  instructions: string;
  starterCode: string;
  points: number;
  language: string;
  questionType?: 'code' | 'mcq';
  options?: McqOption[];
}

export interface TestSession {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  sessionType: string;
  status: string;
  startedAt: string;
  expiresAt: string;
  durationMinutes?: number;
  totalPoints?: number;
  questions: SessionQuestion[];
}

export interface DimensionScore {
  dimension: string;
  score: number;
}

export interface CandidateApplicationItem {
  sessionId: string;
  applicationId: string | null;
  jobId: string;
  jobTitle: string;
  companyName: string;
  jobStatus: string;
  sessionType: 'practice' | 'application' | string;
  sessionStatus: string;
  applicationStatus: string;
  startedAt: string;
  submittedAt: string | null;
  expiresAt: string;
  overallScore: number | null;
  matchPercent: number | null;
  recommendation: string | null;
  hasResult: boolean;
}

export interface CandidateNotificationItem {
  applicationId: string;
  sessionId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  hrStatus: 'interview' | 'declined' | string;
  hrDecidedAt: string | null;
  read: boolean;
  message: string;
}

export interface CandidateNotificationsResponse {
  unreadCount: number;
  items: CandidateNotificationItem[];
}

export interface CandidateApplicationDetail extends CandidateApplicationItem {
  appliedAt: string | null;
  strengths: string[] | null;
  improvements: string[] | null;
  aiSummary: string | null;
  dimensionScores: DimensionScore[] | null;
}

export interface CandidateRow {
  applicationId: string;
  rank?: number;
  isTopMatch?: boolean;
  candidate: {
    id: string;
    fullName: string;
    email: string;
    profile?: CandidateProfileData;
  };
  overallScore: number;
  matchPercent: number;
  recommendation: string;
  strengths: string[];
  improvements: string[];
  aiSummary: string;
  dimensionScores: DimensionScore[];
  appliedAt?: string;
  hrStatus?: 'pending' | 'interview' | 'declined' | string;
  hrDecidedAt?: string | null;
}

export interface JobStats {
  jobId: string;
  applicationsReceived: number;
  verifiedMatches: number;
  topPerformers: number;
}

export interface SessionResult {
  sessionId: string;
  status: 'grading' | 'evaluated';
  overallScore?: number;
  matchPercent?: number;
  recommendation?: string;
  strengths?: string[];
  improvements?: string[];
  aiSummary?: string;
  dimensionScores?: DimensionScore[];
  visibleToCompany?: boolean;
}
