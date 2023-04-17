import { Injectable } from '@nestjs/common';
import { ReleaseCommentDTO } from 'src/comment/dto/releaseComment.dto';
import { QueryCommentsDTO } from 'src/comment/dto/queryComments.dto';
import { CommentIdDTO } from 'src/comment/dto/commentId.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { QueryCommentsVO } from 'src/comment/vo/queryComments.vo';
import { Blog } from '../blog/blog.entity';
import { User } from '../user/user.entity';
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async releaseComment(releaseCommentDTO: ReleaseCommentDTO) {
    const { blogId, commentatorId, replierId } = releaseCommentDTO;
    releaseCommentDTO.commentDate = new Date().toLocaleDateString();
    const blog = await this.blogRepository.findOneBy({ blogId });
    const commentator = await this.userRepository.findOneBy({
      userId: commentatorId,
    });
    const replier = await this.userRepository.findOneBy({
      userId: replierId ?? -1,
    });
    const param = {
      blog,
      commentator,
      replier,
      commentContent: releaseCommentDTO.commentContent,
      commentDate: releaseCommentDTO.commentDate,
      quotedCommentId: releaseCommentDTO.quotedCommentId,
      commentFatherId: releaseCommentDTO.commentFatherId,
    };
    await this.commentRepository.save(param);
    return null;
  }

  async queryComments(queryCommentsDTO: QueryCommentsDTO) {
    const { blogId, limit, pageOffset } = queryCommentsDTO;

    const skip = (pageOffset - 1) * limit;

    const param = {
      skip,
      take: limit,
    };

    Object.assign(param, {
      where: { blog: { blogId } },
      relations: ['blog', 'commentator', 'replier'],
    });

    const [blogComments] = await this.commentRepository.findAndCount(param);
    const blogMainComments: QueryCommentsVO[] = [];

    blogComments.forEach((v) => {
      if (!v.commentFatherId) {
        blogMainComments.push({
          blogId: v.blog.blogId,
          commentatorId: v.commentator.userId,
          commentId: v.commentId,
          commentContent: v.commentContent,
          commentDate: v.commentDate.toString(),
          children: [],
          quotedCommentId: v.quotedCommentId,
          replierId: v.replier?.userId ?? null,
        });
      }
    });

    const tasks = [];
    let tempComments = [];
    for (let i = 0; i < blogMainComments.length; i++) {
      tasks.push(
        new Promise(async (resolve) => {
          tempComments = await this.commentRepository.find({
            where: {
              commentFatherId: blogMainComments[i].commentId,
            },
            relations: ['blog', 'commentator', 'replier'],
          });
          tempComments.forEach((v) => {
            blogMainComments[i].children.push(v);
          });
          resolve(null);
        }),
      );
    }
    await Promise.all(tasks);
    return blogMainComments;
  }

  async deleteComment(deleteCommentDTO: CommentIdDTO) {
    const { commentId } = deleteCommentDTO;
    await this.commentRepository.delete(commentId);
    return null;
  }
}
