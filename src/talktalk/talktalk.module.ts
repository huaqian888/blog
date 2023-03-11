import { Module } from '@nestjs/common';
import { TalktalkController } from './talktalk.controller';
import { TalktalkService } from './talktalk.service';

@Module({
  controllers: [TalktalkController],
  providers: [TalktalkService]
})
export class TalktalkModule {}
