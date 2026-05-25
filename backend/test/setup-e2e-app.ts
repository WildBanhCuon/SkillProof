import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { GeminiService } from '../src/modules/ai/gemini.service';
import { createGeminiMock } from './mocks/gemini.mock';

export async function createE2eApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(GeminiService)
    .useValue(createGeminiMock())
    .compile();

  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix('v1');
  await app.init();
  return app;
}
