import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { TalktalkModule } from './talktalk/talktalk.module';

@Module({
  imports: [BlogModule, UserModule, MessageModule, TalktalkModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
