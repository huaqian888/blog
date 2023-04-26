import { User } from 'src/user/user.entity';

export class QueryCommentsVO {
  blogId: number;

  commentId: number;

  commentator: User;

  commentContent: string;

  commentDate: string;

  children: QueryCommentsVO[];

  quotedCommentId?: number;

  replier?: User;
}
