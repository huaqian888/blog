import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';

@ApiTags('文章')
@Controller('blog')
export class BlogController {
  constructor(private readonly testService: BlogService) {}

  @Get('ee')
  test() {
    return '666';
  }
}
