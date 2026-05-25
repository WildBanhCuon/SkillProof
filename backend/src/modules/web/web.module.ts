import { Module } from '@nestjs/common';
import { WebpageFetchService } from './webpage-fetch.service';

@Module({
  providers: [WebpageFetchService],
  exports: [WebpageFetchService],
})
export class WebModule {}
