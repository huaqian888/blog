import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BlogIdDTO } from 'src/blog/dto/blogId.dto';
import { ListBlogDTO } from 'src/blog/dto/listBlog.dto';
import { UpdateBlogDTO } from 'src/blog/dto/updateBlog.dto';
import { YearDTO } from 'src/blog/dto/year.dto';
import { listBlogVO } from 'src/blog/vo/listBlog.vo';
import { QueryBlogCountByMonthVO } from 'src/blog/vo/queryBlogCountByMonth.vo';
import { BlogService } from './blog.service';
import { AddBlogDTO } from './dto/addBlog.dto';

@ApiTags('文章')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('listBlog')
  @ApiOkResponse({ description: '查询博客文章', type: listBlogVO })
  @HttpCode(HttpStatus.OK)
  listBlog(@Body() listBlogDTO: ListBlogDTO) {
    return this.blogService.listBlog(listBlogDTO);
  }

  @Post('addBlog')
  @ApiOkResponse({ description: '添加博客文章' })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async addBlog(@UploadedFile() file, @Body() addBlogDTO: AddBlogDTO) {
    return this.blogService.addBlog(file, addBlogDTO);
  }

  @Post('updateBlog')
  @ApiOkResponse({ description: '修改博客文章' })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  updateBlog(@UploadedFile() file, @Body() updateBlogDTO: UpdateBlogDTO) {
    return this.blogService.updateBlog(file, updateBlogDTO);
  }

  @Post('deleteBlog')
  @ApiOkResponse({ description: '删除博客文章' })
  @HttpCode(HttpStatus.OK)
  deleteBlog(@Body() blogIdDTO: BlogIdDTO) {
    return this.blogService.deleteBlog(blogIdDTO);
  }

  @Post('featuredBlog')
  @ApiOkResponse({ description: '精选博客文章' })
  @HttpCode(HttpStatus.OK)
  featuredBlog(@Body() blogIdDTO: BlogIdDTO) {
    return this.blogService.featuredBlog(blogIdDTO);
  }

  @Post('cancelFeaturedBlog')
  @ApiOkResponse({ description: '取消精选博客文章' })
  @HttpCode(HttpStatus.OK)
  cancelFeaturedBlog(@Body() blogIdDTO: BlogIdDTO) {
    return this.blogService.cancelFeaturedBlog(blogIdDTO);
  }

  @Post('queryBlogDetails')
  @ApiOkResponse({ description: '查询博客详情' })
  @HttpCode(HttpStatus.OK)
  queryBlogDetails(@Body() blogIdDTO: BlogIdDTO) {
    return this.blogService.queryBlogDetails(blogIdDTO);
  }

  @Post('queryBlogCountByMonth')
  @ApiOkResponse({
    description: '查询每月博客发布数量',
    type: QueryBlogCountByMonthVO,
  })
  @HttpCode(HttpStatus.OK)
  queryBlogCountByMonth(@Body() yearDTO: YearDTO) {
    return this.blogService.queryBlogCountByMonth(yearDTO);
  }

  @Post('queryVisitedByMonth')
  @ApiOkResponse({
    description: '查询每月博客访问量',
    type: QueryBlogCountByMonthVO,
  })
  @HttpCode(HttpStatus.OK)
  queryVisitedByMonth(@Body() yearDTO: YearDTO) {
    return this.blogService.queryVisitedByMonth(yearDTO);
  }
}
