import { Module } from '@nestjs/common';
import { TwitterController } from './twitter.controller';
import { TwitterService } from './twitter.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Twitter } from 'src/twitter/twitter.entity';

@Module({
  controllers: [TwitterController],
  providers: [TwitterService],
  imports: [TypeOrmModule.forFeature([Twitter])],
})
export class TwitterModule {}
