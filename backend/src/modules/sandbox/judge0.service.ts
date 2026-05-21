import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface TestCaseRun {
  testCaseId: string;
  passed: boolean;
  stdout: string;
  stderr: string;
  status: string;
  durationMs?: number;
}

const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63,
  typescript: 74,
};

@Injectable()
export class Judge0Service {
  private readonly logger = new Logger(Judge0Service.name);
  private readonly baseUrl: string;

  constructor(config: ConfigService) {
    this.baseUrl = config.get('JUDGE0_URL', 'http://localhost:2358');
  }

  async ping(): Promise<string> {
    try {
      const res = await fetch(`${this.baseUrl}/about`, { signal: AbortSignal.timeout(3000) });
      return res.ok ? 'ok' : 'error';
    } catch {
      return 'unavailable';
    }
  }

  async runTests(
    sourceCode: string,
    language: string,
    testCases: {
      id: string;
      input?: string | null;
      expectedOutput: string;
      timeoutMs: number;
    }[],
  ): Promise<TestCaseRun[]> {
    const languageId = LANGUAGE_IDS[language] ?? LANGUAGE_IDS.javascript;
    const results: TestCaseRun[] = [];

    for (const tc of testCases) {
      try {
        const result = await this.submitAndWait(
          sourceCode,
          languageId,
          tc.input ?? '',
          tc.expectedOutput,
          tc.timeoutMs,
        );
        results.push({ testCaseId: tc.id, ...result });
      } catch (err) {
        this.logger.warn(`Test case ${tc.id} failed`, err);
        results.push({
          testCaseId: tc.id,
          passed: false,
          stdout: '',
          stderr: String(err),
          status: 'error',
        });
      }
    }
    return results;
  }

  private async submitAndWait(
    sourceCode: string,
    languageId: number,
    stdin: string,
    expectedOutput: string,
    timeoutMs: number,
  ): Promise<Omit<TestCaseRun, 'testCaseId'>> {
    const createRes = await fetch(
      `${this.baseUrl}/submissions?base64_encoded=false&wait=false`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: sourceCode,
          language_id: languageId,
          stdin,
          expected_output: expectedOutput,
          cpu_time_limit: Math.ceil(timeoutMs / 1000),
        }),
      },
    );

    if (!createRes.ok) {
      throw new Error(`Judge0 submit failed: ${createRes.status}`);
    }

    const { token } = (await createRes.json()) as { token: string };
    const deadline = Date.now() + timeoutMs + 10000;

    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 500));
      const pollRes = await fetch(
        `${this.baseUrl}/submissions/${token}?base64_encoded=false`,
      );
      if (!pollRes.ok) continue;
      const data = (await pollRes.json()) as {
        status?: { id: number; description: string };
        stdout?: string | null;
        stderr?: string | null;
        time?: string;
      };
      const statusId = data.status?.id ?? 1;
      if (statusId <= 2) continue;

      const stdout = (data.stdout ?? '').trim();
      const passed =
        statusId === 3 &&
        stdout === expectedOutput.trim();
      return {
        passed,
        stdout: data.stdout ?? '',
        stderr: data.stderr ?? '',
        status: data.status?.description ?? 'unknown',
        durationMs: data.time ? parseFloat(data.time) * 1000 : undefined,
      };
    }

    return {
      passed: false,
      stdout: '',
      stderr: 'Execution timed out',
      status: 'timeout',
    };
  }
}
