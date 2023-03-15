import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from '../blog/blog.entity';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn({ name: 'comment_id' })
  commentId: number;

  @Column({ name: 'comment_father_id', nullable: true })
  commentFatherId: number;

  @Column({ name: 'quoted_comment_id', nullable: true })
  quotedCommentId: number;

  @ManyToOne(() => Blog, { nullable: false })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'commentator_id' })
  commentator: User;

  @Column({ name: 'comment_content' })
  commentContent: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'replier_id' })
  replier: User;

  @Column({ name: 'comment_date', type: 'date' })
  commentDate: Date;
}
