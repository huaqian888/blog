import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { listBlogVO } from 'src/blog/vo/listBlog.vo';
import { ReleaseCommentDTO } from './dto/releaseComment.dto';
import { QueryCommentsDTO } from './dto/queryComments.dto';
import { CommentIdDTO } from './dto/commentId.dto';
import { CommentService } from 'src/comment/comment.service';

@ApiTags('评论')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post('releaseComment')
  @ApiOkResponse({ description: '发布评论' })
  @HttpCode(HttpStatus.OK)
  releaseComment(@Body() releaseCommentDTO: ReleaseCommentDTO) {
    return this.commentService.releaseComment(releaseCommentDTO);
  }

  @Post('queryComments')
  @ApiOkResponse({ description: '查询评论' })
  @HttpCode(HttpStatus.OK)
  queryComments(@Body() queryCommentsDTO: QueryCommentsDTO) {
    return this.commentService.queryComments(queryCommentsDTO);
  }

  @Post('deleteComment')
  @ApiOkResponse({ description: '删除评论' })
  @HttpCode(HttpStatus.OK)
  deleteComment(@Body() deleteCommentDTO: CommentIdDTO) {
    return this.commentService.deleteComment(deleteCommentDTO);
  }

  @Post('queryCommentById')
  @ApiOkResponse({ description: '通过Id查询评论' })
  @HttpCode(HttpStatus.OK)
  queryCommentById(@Body() commentId: CommentIdDTO) {
    return this.commentService.queryCommentById(commentId);
  }
}
