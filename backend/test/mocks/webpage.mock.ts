import { WebpageFetchService } from '../../src/modules/web/webpage-fetch.service';

export const createWebpageMock = (): Partial<WebpageFetchService> => ({
  normalizeWebsiteUrl: jest
    .fn()
    .mockImplementation((url: string) =>
      url.startsWith('http') ? url.replace(/\/$/, '') : `https://${url}`,
    ),
  collectPublicText: jest.fn().mockResolvedValue([
    {
      url: 'https://example.com/',
      text: 'Acme is a web agency in Lyon building WordPress sites for local businesses.',
    },
  ]),
});
