import { Injectable } from '@nestjs/common';
import { ReleaseTwitterDTO } from 'src/twitter/dto/releaseTwitter.dto';
import { QueryTwitterDTO } from 'src/twitter/dto/queryTwitters.dto';
import { TwitterIdDTO } from 'src/twitter/dto/twitterId.dto';
import { UpdateTwitterDTO } from 'src/twitter/dto/updateTwitter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Twitter } from './twitter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TwitterService {
  constructor(
    @InjectRepository(Twitter)
    private readonly twitterRepository: Repository<Twitter>,
  ) {}

  async releaseTwitter(releaseTwitterDTO: ReleaseTwitterDTO) {
    releaseTwitterDTO.twitterReleaseDateTime = new Date().toLocaleString();
    await this.twitterRepository.save(releaseTwitterDTO);
    return null;
  }

  async queryTwitters(queryTwitterDTO: QueryTwitterDTO) {
    const { pageOffset, limit } = queryTwitterDTO;
    const skip = (pageOffset - 1) * limit;

    const params = {
      skip,
      take: limit,
    };

    const [twitterList, count] = await this.twitterRepository.findAndCount({
      order: {
        twitterReleaseDateTime: 'DESC',
      },
      ...params,
    });
    return {
      twitterList,
      count,
    };
  }

  async deleteTwitter(twitterIdDTO: TwitterIdDTO) {
    const { twitterId } = twitterIdDTO;
    await this.twitterRepository.delete(twitterId);
    return null;
  }

  async updateTwitter(updateTwitterDTO: UpdateTwitterDTO) {
    const { twitterId, twitterContent } = updateTwitterDTO;
    await this.twitterRepository.update(twitterId, { twitterContent });
    return null;
  }
}
