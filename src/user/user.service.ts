import { HttpException, Injectable } from '@nestjs/common';
import { RegisterDTO } from 'src/user/dto/register.dto';
import { LoginDTO } from 'src/user/dto/login.dto';
import { ListUsersDTO } from 'src/user/dto/listUsers.dto';
import { UserIdDTO } from 'src/user/dto/userId.dto';
import { UpdateUserInfoDTO } from 'src/user/dto/updateUserInfo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Like, Repository } from 'typeorm';
import * as fs from 'fs';
import { join } from 'path';
import { QueryBloggerVO } from 'src/user/vo/queryBlogger.vo';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userResository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async register(registerDTO: RegisterDTO) {
    const { userName } = registerDTO;
    const user = await this.userResository.findOneBy({
      userName,
    });
    if (user) {
      throw new Error('该用户已存在');
    }
    await this.userResository.save({
      userName: registerDTO.userName,
      userPasswd: registerDTO.passwd,
      userType: 1,
    });
    return null;
  }

  async login(loginDTO: LoginDTO) {
    const { userName, passwd } = loginDTO;
    const user = await this.userResository.findOneBy({
      userName,
      userPasswd: passwd,
    });
    if (!user) {
      throw new HttpException('该用户不存在', 444);
    }
    const { userId } = user;
    return this.queryUserInfo({ userId });
  }

  async listUsers(listUsersDTO: ListUsersDTO) {
    const { limit, pageOffset, userName } = listUsersDTO;
    const skip = limit * (pageOffset - 1);
    const param = {
      skip,
      take: limit,
    };

    const whereParams = {};

    if (userName) {
      Object.assign(whereParams, {
        userName: Like(`%${userName}%`),
      });
    }

    Object.assign(param, {
      where: whereParams,
    });

    const [usersList, count] = await this.userResository.findAndCount(param);

    return { usersList, count };
  }

  async deleteUser(userIdDTO: UserIdDTO) {
    const { userId } = userIdDTO;
    const user = await this.userResository.findOneBy({ userId });
    if (!user) {
      throw new Error('用户不存在');
    }
    await this.userResository.delete(userId);
    return null;
  }

  async queryUserInfo(userIdDTO: UserIdDTO) {
    const { userId } = userIdDTO;
    const user = await this.userResository.findOneBy({ userId });
    if (!user) {
      throw new HttpException('该用户不存在', 444);
    }
    delete user.userPasswd;
    return user;
  }

  async updateUserInfo(avatar, updateUserInfoDTO: UpdateUserInfoDTO) {
    const { userId, userName } = updateUserInfoDTO;
    const user = await this.userResository.findOneBy({ userId, userName });
    if (avatar) {
      const fileName = avatar.filename;
      if (!user) {
        fs.rmSync(join(__dirname, '../../image') + '\\' + fileName);
        throw new HttpException('该用户不存在', 444);
      }
      if (!user.userAvatar.includes('default')) {
        const userAvatarPath = user.userAvatar.split('/').pop();
        fs.rmSync(join(__dirname, '../../image') + '\\' + userAvatarPath);
      }
      updateUserInfoDTO.userAvatar = `${this.configService.get(
        'BASE_URL',
      )}/${fileName}`;
    }
    if (userName) {
      const updateUser = await this.userResository.findOneBy({ userName });
      if (updateUser) {
        throw new HttpException('该账户已存在', 444);
      }
    }
    delete updateUserInfoDTO.userType;
    await this.userResository.update(userId, updateUserInfoDTO);
    return this.queryUserInfo({ userId });
  }

  async queryBloggerInfo() {
    const res: QueryBloggerVO = {
      userQQ: '1107507933',
      userWx: 'huaqian57',
      userGit: 'https://github.com/huaqian888/blogUni-app',
      userName: '',
      userAvatar: '',
    };
    const user = await this.userResository.findOneBy({ userId: 1 });
    Object.assign(res, {
      userName: user.userName,
      userAvatar: user.userAvatar,
    });
    return res;
  }
}
