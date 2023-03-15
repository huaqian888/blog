export class ReleaseCommentDTO {
  blogId: number;

  commentFatherId?: number;

  quotedCommentId?: number;

  commentatorId: number;

  commentContent: string;

  replierId?: number;

  commentDate?: string;
}
