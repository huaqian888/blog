import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Blog } from './blog.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../image'),
        filename(req, file, callback) {
          const fileName = `${
            new Date().getTime() + extname(file.originalname)
          }`;
          callback(null, fileName);
        },
      }),
    }),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
