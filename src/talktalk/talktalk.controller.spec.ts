import { Test, TestingModule } from '@nestjs/testing';
import { TalktalkController } from './talktalk.controller';

describe('TalktalkController', () => {
  let controller: TalktalkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TalktalkController],
    }).compile();

    controller = module.get<TalktalkController>(TalktalkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
