import {
  Body,
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDTO } from 'src/user/dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { ListUsersDTO } from './dto/listUsers.dto';
import { UserIdDTO } from './dto/userId.dto';
import { UpdateUserInfoDTO } from './dto/updateUserInfo.dto';
import { UserService } from './user.service';
import { ListUsersVO } from './vo/listUsers.vo';
import { QueryUserInfoVO } from './vo/queryUserInfo.vo';
import { QueryBloggerVO } from 'src/user/vo/queryBlogger.vo';
import { FileInterceptor } from '@nestjs/platform-express/multer';
@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: '注册' })
  register(@Body() registerDTO: RegisterDTO) {
    return this.userService.register(registerDTO);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: '登录' })
  login(@Body() loginDTO: LoginDTO) {
    return this.userService.login(loginDTO);
  }

  @Post('listUsers')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: '查询所有用户', type: ListUsersVO })
  listUsers(@Body() listUsersDTO: ListUsersDTO) {
    return this.userService.listUsers(listUsersDTO);
  }

  @Post('deleteUser')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: '删除用户' })
  deleteUser(@Body() userIdDTO: UserIdDTO) {
    return this.userService.deleteUser(userIdDTO);
  }

  @Post('queryUserInfo')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: '查询个人信息', type: QueryUserInfoVO })
  queryUserInfo(@Body() userIdDTO: UserIdDTO) {
    return this.userService.queryUserInfo(userIdDTO);
  }

  @Post('updateUserInfo')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: '修改个人信息' })
  @UseInterceptors(FileInterceptor('avatar'))
  updateUserInfo(
    @UploadedFile() avatar,
    @Body() updateUserInfoDTO: UpdateUserInfoDTO,
  ) {
    return this.userService.updateUserInfo(avatar, updateUserInfoDTO);
  }

  @Post('queryBloggerInfo')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: '查询作者信息', type: QueryBloggerVO })
  queryBloggerInfo() {
    return this.userService.queryBloggerInfo();
  }
}
