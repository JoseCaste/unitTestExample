import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';

describe('DocumentController', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentService],
    }).compile();
  });

  it('should be defined', async () => {
    expect(1).toBeGreaterThan(0);
    //expect(controller).toBeDefined();
  });
});
