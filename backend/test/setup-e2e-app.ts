import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { GeminiService } from '../src/modules/ai/gemini.service';
import { WebpageFetchService } from '../src/modules/web/webpage-fetch.service';
import { createGeminiMock } from './mocks/gemini.mock';
import { createWebpageMock } from './mocks/webpage.mock';

export async function createE2eApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(GeminiService)
    .useValue(createGeminiMock())
    .overrideProvider(WebpageFetchService)
    .useValue(createWebpageMock())
    .compile();

  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix('v1');
  await app.init();
  return app;
}
