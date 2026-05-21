import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common/interfaces';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { GeminiService } from '../src/modules/ai/gemini.service';
import { Judge0Service } from '../src/modules/sandbox/judge0.service';
import { createGeminiMock } from './mocks/gemini.mock';
import { createJudge0Mock } from './mocks/judge0.mock';

export async function createE2eApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(GeminiService)
    .useValue(createGeminiMock())
    .overrideProvider(Judge0Service)
    .useValue(createJudge0Mock())
    .compile();

  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.init();
  return app;
}
