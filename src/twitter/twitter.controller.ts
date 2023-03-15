import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QueryTwitterDTO } from 'src/twitter/dto/queryTwitters.dto';
import { TwitterService } from './twitter.service';
import { ReleaseTwitterDTO } from './dto/releaseTwitter.dto';
import { TwitterIdDTO } from './dto/twitterId.dto';
import { UpdateTwitterDTO } from './dto/updateTwitter.dto';
@ApiTags('说说')
@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Post('releaseTwitter')
  @ApiOkResponse({ description: '发布说说' })
  @HttpCode(HttpStatus.OK)
  releaseTwitter(@Body() releaseTwitterDTO: ReleaseTwitterDTO) {
    return this.twitterService.releaseTwitter(releaseTwitterDTO);
  }

  @Post('queryTwitters')
  @ApiOkResponse({ description: '查询说说' })
  @HttpCode(HttpStatus.OK)
  queryTwitters(@Body() queryTwitterDTO: QueryTwitterDTO) {
    return this.twitterService.queryTwitters(queryTwitterDTO);
  }

  @Post('deleteTwitter')
  @ApiOkResponse({ description: '删除说说' })
  @HttpCode(HttpStatus.OK)
  deleteTwitter(@Body() twitterIdDTO: TwitterIdDTO) {
    return this.twitterService.deleteTwitter(twitterIdDTO);
  }

  @Post('updateTwitter')
  @ApiOkResponse({ description: '修改说说' })
  @HttpCode(HttpStatus.OK)
  updateTwitter(@Body() updateTwitterDTO: UpdateTwitterDTO) {
    return this.twitterService.updateTwitter(updateTwitterDTO);
  }
}
