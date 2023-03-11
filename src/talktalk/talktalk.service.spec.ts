import { Test, TestingModule } from '@nestjs/testing';
import { TalktalkService } from './talktalk.service';

describe('TalktalkService', () => {
  let service: TalktalkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TalktalkService],
    }).compile();

    service = module.get<TalktalkService>(TalktalkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
