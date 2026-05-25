import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createE2eApp } from './setup-e2e-app';

const HR_EMAIL = 'marion@acme.test';
const CANDIDATE_EMAIL = 'sofiane@test.com';
const PASSWORD = 'Password123!';

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

async function waitForEvaluated(
  app: INestApplication,
  sessionId: string,
  token: string,
  maxMs = 20000,
) {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    const res = await request(app.getHttpServer())
      .get(`/v1/sessions/${sessionId}/result`)
      .set(authHeader(token));
    if (res.status === 200 && res.body.status === 'evaluated') {
      return res;
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Timed out waiting for session ${sessionId} to be graded`);
}

async function login(
  app: INestApplication,
  email: string,
  role: 'hr' | 'candidate',
) {
  const res = await request(app.getHttpServer())
    .post('/v1/auth/login')
    .send({ email, password: PASSWORD, role })
    .expect(201);
  return res.body as {
    accessToken: string;
    refreshToken: string;
  };
}

describe('SkillProof API (e2e)', () => {
  let app: INestApplication;
  let hrToken: string;
  let hrRefresh: string;
  let candidateToken: string;
  let jobId: string;
  let sessionId: string;
  let questionId: string;
  let applicationId: string;

  beforeAll(async () => {
    app = await createE2eApp();
  }, 60000);

  afterAll(async () => {
    await app.close();
  });

  describe('Health', () => {
    it('GET /v1/health', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/health')
        .expect(200);
      expect(res.body.service).toBe('skillproof-api');
      expect(res.body.checks.database).toBe('ok');
    });
  });

  describe('Auth', () => {
    const unique = Date.now();

    it('POST /v1/auth/hr/register', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/hr/register')
        .send({
          email: `hr.e2e.${unique}@test.com`,
          password: PASSWORD,
          fullName: 'E2E HR',
          companyName: 'E2E Co',
          teamProfile:
            'E2E test company building hiring tools for technical recruiters.',
        })
        .expect(201);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it('POST /v1/auth/candidate/register', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/candidate/register')
        .send({
          email: `candidate.e2e.${unique}@test.com`,
          password: PASSWORD,
          displayName: 'E2E Candidate',
        })
        .expect(201);
      expect(res.body.accessToken).toBeDefined();
    });

    it('POST /v1/auth/login (HR seed)', async () => {
      const tokens = await login(app, HR_EMAIL, 'hr');
      hrToken = tokens.accessToken;
      hrRefresh = tokens.refreshToken;
      expect(hrToken).toBeTruthy();
    });

    it('GET /v1/auth/me (HR)', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/auth/me')
        .set(authHeader(hrToken))
        .expect(200);
      expect(res.body.email).toBe(HR_EMAIL);
      expect(res.body.role).toBe('hr');
    });

    it('POST /v1/auth/refresh', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/refresh')
        .send({ refreshToken: hrRefresh })
        .expect(201);
      expect(res.body.accessToken).toBeDefined();
      hrToken = res.body.accessToken;
      if (res.body.refreshToken) hrRefresh = res.body.refreshToken;
    });
  });

  describe('HR — Jobs lifecycle', () => {
    const jobBody = {
      title: 'Junior Frontend Developer',
      description:
        'Junior frontend role.\n\nRequirements:\n- 3+ years React\n- Kubernetes required',
    };

    it('POST /v1/jobs — create draft', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/jobs')
        .set(authHeader(hrToken))
        .send(jobBody)
        .expect(201);
      jobId = res.body.id;
      expect(res.body.status).toBe('DRAFT');
    });

    it('GET /v1/jobs — list (HR)', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/jobs')
        .set(authHeader(hrToken))
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some((j: { id: string }) => j.id === jobId)).toBe(true);
    });

    it('GET /v1/jobs/:id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/jobs/${jobId}`)
        .set(authHeader(hrToken))
        .expect(200);
      expect(res.body.id).toBe(jobId);
    });

    it('PATCH /v1/jobs/:id', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/v1/jobs/${jobId}`)
        .set(authHeader(hrToken))
        .send({
          title: jobBody.title,
          description: 'Updated junior frontend draft for e2e tests.',
        })
        .expect(200);
      expect(res.body.description).toContain('e2e');
    });

    it('POST /v1/jobs/:id/check-listing', async () => {
      const res = await request(app.getHttpServer())
        .post(`/v1/jobs/${jobId}/check-listing`)
        .set(authHeader(hrToken))
        .expect(201);
      expect(res.body.status).toBe('ANALYZED');
      expect(res.body.skillRequirements?.length).toBeGreaterThan(0);
    });

    it('POST /v1/jobs/:id/accept-suggestions', async () => {
      const res = await request(app.getHttpServer())
        .post(`/v1/jobs/${jobId}/accept-suggestions`)
        .set(authHeader(hrToken))
        .expect(201);
      expect(res.body.improvedDescription).toBeDefined();
    });

    it('POST /v1/jobs/:id/apply-suggestions', async () => {
      const res = await request(app.getHttpServer())
        .post(`/v1/jobs/${jobId}/apply-suggestions`)
        .set(authHeader(hrToken))
        .expect(201);
      expect(res.body.description).toContain('Junior Frontend');
    });

    it('POST /v1/jobs/:id/publish', async () => {
      const res = await request(app.getHttpServer())
        .post(`/v1/jobs/${jobId}/publish`)
        .set(authHeader(hrToken))
        .expect(201);
      expect(res.body.status).toBe('PUBLISHED');
      expect(res.body.assessment).toBeDefined();
    });

    it('GET /v1/jobs/:id/assessment', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/jobs/${jobId}/assessment`)
        .set(authHeader(hrToken))
        .expect(200);
      expect(res.body.questions?.length).toBe(4);
      questionId = res.body.questions[0].id;
    });
  });

  describe('Candidate — Jobs & sessions', () => {
    it('POST /v1/auth/login (candidate seed)', async () => {
      const tokens = await login(app, CANDIDATE_EMAIL, 'candidate');
      candidateToken = tokens.accessToken;
    });

    it('GET /v1/jobs — list published', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/jobs')
        .set(authHeader(candidateToken))
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some((j: { id: string }) => j.id === jobId)).toBe(true);
    });

    it('GET /v1/jobs/:id — published job', async () => {
      await request(app.getHttpServer())
        .get(`/v1/jobs/${jobId}`)
        .set(authHeader(candidateToken))
        .expect(200);
    });

    it('POST /v1/jobs/:id/sessions — application', async () => {
      const res = await request(app.getHttpServer())
        .post(`/v1/jobs/${jobId}/sessions`)
        .set(authHeader(candidateToken))
        .send({ mode: 'application' })
        .expect(201);
      sessionId = res.body.id;
      questionId = res.body.questions[0].id;
      expect(res.body.sessionType).toBe('application');
    });

    it('PATCH /v1/sessions/:id/answers/:questionId', async () => {
      await request(app.getHttpServer())
        .patch(`/v1/sessions/${sessionId}/answers/${questionId}`)
        .set(authHeader(candidateToken))
        .send({
          submittedCode:
            'function App() { return React.createElement("div", null, "ok"); }',
          notes: 'e2e test answer',
        })
        .expect(200);
    });

    it('POST /v1/sessions/:id/answers/:questionId/run', async () => {
      const res = await request(app.getHttpServer())
        .post(`/v1/sessions/${sessionId}/answers/${questionId}/run`)
        .set(authHeader(candidateToken))
        .expect(201);
      expect(res.body.runs).toBeDefined();
      expect(res.body.runs.length).toBeGreaterThan(0);
      expect(res.body.runs[0].passed).toBe(true);
    });

    it('POST /v1/sessions/:id/submit', async () => {
      const res = await request(app.getHttpServer())
        .post(`/v1/sessions/${sessionId}/submit`)
        .set(authHeader(candidateToken))
        .expect(202);
      expect(res.body.status).toBe('queued');
    });

    it('GET /v1/sessions/:id/result — evaluated', async () => {
      const res = await waitForEvaluated(
        app,
        sessionId,
        candidateToken,
      );
      expect(res.body.overallScore).toBe(78);
    });
  });

  describe('HR — Results', () => {
    it('GET /v1/jobs/:id/stats', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/jobs/${jobId}/stats`)
        .set(authHeader(hrToken))
        .expect(200);
      expect(res.body).toBeDefined();
    });

    it('GET /v1/jobs/:id/candidates', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/jobs/${jobId}/candidates`)
        .query({ sort: 'score' })
        .set(authHeader(hrToken))
        .expect(200);
      expect(res.body.candidates?.length).toBeGreaterThan(0);
      applicationId = res.body.candidates[0].applicationId;
    });

    it('GET /v1/jobs/:id/candidates/:applicationId', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/jobs/${jobId}/candidates/${applicationId}`)
        .set(authHeader(hrToken))
        .expect(200);
      expect(res.body.applicationId ?? res.body.id).toBeDefined();
    });

    it('POST /v1/jobs/:id/archive', async () => {
      const res = await request(app.getHttpServer())
        .post(`/v1/jobs/${jobId}/archive`)
        .set(authHeader(hrToken))
        .expect(201);
      expect(res.body.status).toBe('CLOSED');
    });
  });

  describe('Auth — logout', () => {
    it('POST /v1/auth/logout', async () => {
      await request(app.getHttpServer())
        .post('/v1/auth/logout')
        .set(authHeader(hrToken))
        .send({ refreshToken: hrRefresh })
        .expect(201);
    });
  });

  describe('Authorization', () => {
    it('rejects candidate creating a job', async () => {
      await request(app.getHttpServer())
        .post('/v1/jobs')
        .set(authHeader(candidateToken))
        .send({
          title: 'Blocked',
          description: 'Should fail',
        })
        .expect(403);
    });

    it('rejects unauthenticated /v1/auth/me', async () => {
      await request(app.getHttpServer()).get('/v1/auth/me').expect(401);
    });
  });
});
