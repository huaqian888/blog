import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/blog/blog.entity';
import { AddBlogDTO } from 'src/blog/dto/addBlog.dto';
import { BlogIdDTO } from 'src/blog/dto/blogId.dto';
import { ListBlogDTO } from 'src/blog/dto/listBlog.dto';
import { UpdateBlogDTO } from 'src/blog/dto/updateBlog.dto';
import { YearDTO } from 'src/blog/dto/year.dto';
import { QueryBlogDetailsVO } from 'src/blog/vo/queryBlogDetails.vo';
import { Like, Repository } from 'typeorm';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  async listBlog(listBlogDTO: ListBlogDTO) {
    const { pageOffset = 1, limit = 10, blogTitle } = listBlogDTO;
    const skip = (pageOffset - 1) * limit;

    const params = {
      skip,
      take: limit,
    };

    const whereParams = {};

    if (blogTitle) {
      Object.assign(whereParams, {
        blogTitle: Like(`%${blogTitle}%`),
      });
    }

    Object.assign(params, {
      where: whereParams,
      order: {
        blogFeatured: 'DESC',
        blogReleaseDate: 'DESC',
      },
    });

    const [blogList, count] = await this.blogRepository.findAndCount(params);
    return {
      blogList,
      count,
    };
  }

  async addBlog(file, addBlogDTO: AddBlogDTO) {
    const { blogReleaseDate } = addBlogDTO;
    addBlogDTO.blogReleaseDate =
      blogReleaseDate || new Date().toLocaleDateString();
    addBlogDTO.blogCover = `${process.env.BASE_URL + file.filename}`;
    await this.blogRepository.save(addBlogDTO);
    return null;
  }

  async updateBlog(file, updateBlogDTO: UpdateBlogDTO) {
    const { blogId } = updateBlogDTO;
    const blog = await this.blogRepository.findOneBy({ blogId });
    if (!blog) {
      throw new Error('该文章不存在');
    }
    const filename = blog.blogCover.split('/').pop();
    fs.rmSync(join(__dirname, '../../image') + '\\' + filename);
    updateBlogDTO.blogCover = `${process.env.BASE_URL + file.filename}`;
    Object.assign(blog, updateBlogDTO);
    await this.blogRepository.update(blogId, blog);
    return null;
  }

  async deleteBlog(blogIdDTO: BlogIdDTO) {
    const { blogId } = blogIdDTO;
    await this.blogRepository.delete(blogId);
    return null;
  }

  async featuredBlog(blogIdDTO: BlogIdDTO) {
    const { blogId } = blogIdDTO;
    const blog = await this.blogRepository.findOneBy({ blogId });
    if (!blog) {
      throw new Error('该文章不存在');
    }
    blog.blogFeatured = true;
    await this.blogRepository.save(blog);
    return null;
  }

  async cancelFeaturedBlog(blogIdDTO: BlogIdDTO) {
    const { blogId } = blogIdDTO;
    const blog = await this.blogRepository.findOneBy({ blogId });
    if (!blog) {
      throw new Error('该文章不存在');
    }
    blog.blogFeatured = false;
    await this.blogRepository.save(blog);
    return null;
  }

  async queryBlogDetails(blogIdDTO: BlogIdDTO) {
    const { blogId } = blogIdDTO;
    const blog = await this.blogRepository.findOneBy({ blogId });
    if (!blog) {
      throw new Error('该文章不存在');
    }
    blog.blogViewCount++;
    await this.blogRepository.save(blog);
    const res: QueryBlogDetailsVO = {
      blogTitle: blog.blogTitle,
      blogContent: blog.blogContent,
      blogCommentCount: blog.blogCommentCount,
      blogReleaseDate: new Date(blog.blogReleaseDate).toLocaleDateString(),
      blogViewCount: blog.blogViewCount,
    };
    return res;
  }

  async queryBlogCountByMonth(yearDTO: YearDTO) {
    const monthsBlogCount = [];
    const { year } = yearDTO;
    for (let i = 1; i <= 12; i++) {
      const [, count] = await this.blogRepository.findAndCount({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        where: { blogReleaseDate: Like(`${year}-${i < 10 ? `0${i}` : i}%`) },
      });
      monthsBlogCount[i] = count;
    }
    return monthsBlogCount;
  }

  async queryVisitedByMonth(yearDTO: YearDTO) {
    const monthsViewCount = [];
    const { year } = yearDTO;
    for (let i = 1; i <= 12; i++) {
      const [list] = await this.blogRepository.findAndCount({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        where: { blogReleaseDate: Like(`${year}-${i < 10 ? `0${i}` : i}%`) },
      });
      monthsViewCount[i] = list.reduce((sum, item) => {
        sum += item.blogViewCount;
        return sum;
      }, 0);
    }
    return monthsViewCount;
  }
}
