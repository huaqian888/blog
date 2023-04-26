import { Injectable } from '@nestjs/common';
import { ReleaseCommentDTO } from 'src/comment/dto/releaseComment.dto';
import { QueryCommentsDTO } from 'src/comment/dto/queryComments.dto';
import { CommentIdDTO } from 'src/comment/dto/commentId.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
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
  ) {}

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
    blog.blogCommentCount++;
    await this.blogRepository.save(blog);
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
      where: { blog: { blogId }, commentFatherId: IsNull() },
      relations: ['blog', 'commentator', 'replier'],
      order: {
        commentId: 'desc',
      },
    });

    const [blogComments, count] = await this.commentRepository.findAndCount(
      param,
    );
    const blogMainComments: QueryCommentsVO[] = [];

    blogComments.forEach((v) => {
      blogMainComments.push({
        blogId: v.blog.blogId,
        commentator: v.commentator,
        commentId: v.commentId,
        commentContent: v.commentContent,
        commentDate: v.commentDate.toString(),
        children: [],
        quotedCommentId: v.quotedCommentId,
        replier: v.replier,
      });
    });

    const tasks = [];
    let tempComments = [];
    for (let i = 0; i < blogMainComments.length; i++) {
      delete blogMainComments[i].commentator.userPasswd;
      delete blogMainComments[i].replier?.userPasswd;
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
    return { blogMainComments, count };
  }

  async queryCommentById(commentId: CommentIdDTO) {
    const comment = await this.commentRepository.findOne({
      where: {
        commentId: commentId.commentId,
      },
      relations: ['blog', 'commentator', 'replier'],
    });
    const mainComment: QueryCommentsVO = {
      blogId: 0,
      commentId: 0,
      commentator: new User(),
      commentContent: '',
      commentDate: '',
      children: [],
    };
    Object.assign(mainComment, {
      blogId: comment.blog.blogId,
      commentator: comment.commentator,
      commentId: comment.commentId,
      commentContent: comment.commentContent,
      commentDate: comment.commentDate.toString(),
      children: [],
      quotedCommentId: comment.quotedCommentId,
      replier: comment.replier,
    });
    delete mainComment.commentator.userPasswd;
    delete mainComment.replier?.userPasswd;
    let tempComments;
    await new Promise(async (resolve) => {
      tempComments = await this.commentRepository.find({
        where: {
          commentFatherId: mainComment.commentId,
        },
        relations: ['blog', 'commentator', 'replier'],
      });
      tempComments.forEach((v) => {
        mainComment.children.push(v);
      });
      resolve(null);
    });
    return mainComment;
  }

  async deleteComment(deleteCommentDTO: CommentIdDTO) {
    const { commentId } = deleteCommentDTO;
    await this.commentRepository.delete(commentId);
    return null;
  }
}
