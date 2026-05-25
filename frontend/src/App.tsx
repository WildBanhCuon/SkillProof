import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { HrLayout } from './components/layout/HrLayout';
import { CandidateLayout } from './components/layout/CandidateLayout';
import { LandingPage } from './pages/landing/LandingPage';
import { AuthLayout } from './pages/auth/AuthLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { JobsListPage } from './pages/hr/JobsListPage';
import { JobEditorPage } from './pages/hr/JobEditorPage';
import { JobWizardPage } from './pages/hr/JobWizardPage';
import { JobResultsPage } from './pages/hr/JobResultsPage';
import { CandidateDetailPage } from './pages/hr/CandidateDetailPage';
import { JobsBrowsePage } from './pages/candidate/JobsBrowsePage';
import { JobDetailPage } from './pages/candidate/JobDetailPage';
import { AssessmentPage } from './pages/candidate/AssessmentPage';
import { ResultPage } from './pages/candidate/ResultPage';
import { useAuth } from './auth/AuthContext';

function HomeRedirect() {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <LandingPage />;
  if (user?.role === 'hr') return <Navigate to="/hr/jobs" replace />;
  return <Navigate to="/jobs" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route
            path="/hr"
            element={
              <ProtectedRoute role="hr">
                <HrLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/hr/jobs" replace />} />
            <Route path="jobs" element={<JobsListPage />} />
            <Route path="jobs/wizard" element={<JobWizardPage />} />
            <Route path="jobs/new" element={<JobEditorPage />} />
            <Route path="jobs/:id" element={<JobEditorPage />} />
            <Route path="jobs/:id/results" element={<JobResultsPage />} />
            <Route
              path="jobs/:id/candidates/:applicationId"
              element={<CandidateDetailPage />}
            />
          </Route>

          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute role="candidate">
                <CandidateLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<JobDetailPage />} />
          </Route>

          <Route
            path="/jobs"
            element={
              <ProtectedRoute role="candidate">
                <CandidateLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<JobsBrowsePage />} />
          </Route>

          <Route
            path="/sessions/:sessionId"
            element={
              <ProtectedRoute role="candidate">
                <AssessmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sessions/:sessionId/result"
            element={
              <ProtectedRoute role="candidate">
                <ResultPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
