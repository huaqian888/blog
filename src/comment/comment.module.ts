import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Comment } from 'src/comment/comment.entity';
import { Blog } from '../blog/blog.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Blog, User])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
