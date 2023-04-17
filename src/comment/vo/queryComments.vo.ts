export class QueryCommentsVO {
  blogId: number;

  commentId: number;

  commentatorId: number;

  commentContent: string;

  commentDate: string;

  children: QueryCommentsVO[];

  quotedCommentId?: number;

  replierId?: number;
}
