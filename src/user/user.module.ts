import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { User } from 'src/user/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ConfigModule } from '@nestjs/config';
import envConfig from '../..//config/env';
@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envConfig.path],
    }),
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
})
export class UserModule {}
