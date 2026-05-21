import { Judge0Service } from '../../src/modules/sandbox/judge0.service';

export const createJudge0Mock = (): Partial<Judge0Service> => ({
  ping: jest.fn().mockResolvedValue('ok'),
  runTests: jest.fn().mockImplementation(
    async (
      _code: string,
      _lang: string,
      testCases: { id: string }[],
    ) =>
      testCases.map((tc) => ({
        testCaseId: tc.id,
        passed: true,
        stdout: 'ok',
        stderr: '',
        status: 'Accepted',
        durationMs: 10,
      })),
  ),
});
