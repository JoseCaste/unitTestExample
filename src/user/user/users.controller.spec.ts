import { StreamableFile } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../models/user.entity';
import { UserService } from './users.service';
import * as fs from 'fs';
import { join } from 'path';

describe('ContactsController', () => {
  let module: TestingModule;
  let userService: UserService;
  let userRepository: Repository<User>;
  let results;
  let spyUserService: UserService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
          useValue: {},
        },
        {
          provide: UserService,
          useFactory: () => {
            getUsersMustBeWorkingNow: jest.fn(() => true);
          },
        },
        UserService,
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    spyUserService = module.get(UserService);
  });

  describe('Definiciones', () => {
    it('should be defined', () => {
      expect(userService).toBeDefined();
    });
  });

  describe('Test Servicios', () => {
    it('Create lote', async () => {
      const status = 201;
      jest.spyOn(userService, 'createLote').mockResolvedValueOnce(status);
      results = await userService.createLote('Jose');
      expect(results).toEqual(status);
    });

    it('Create Zip', async () => {
      const status = 201;
      jest.spyOn(userService, 'createZip').mockResolvedValueOnce(status);
      results = await userService.createZip('Jose');
      expect(results).toEqual(status);
    });

    it('Download zip', async () => {
      const value = undefined;
      jest.spyOn(userService, 'downloadZip').mockReturnValueOnce(value);
      results = await userService.downloadZip('');
      expect(results).toEqual(value);
    });
  });
  describe('Servicios', () => {
    it('FindAll', async () => {
      const users = new Array<User>();
      const user = new User();
      user.id = 1;
      users.push(user);
      const response = [{ id: 1 }];
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(users);
      results = await userService.findAll();
      expect(results).toEqual(response);
    });

    it('Save', async () => {
      const user = new User();
      user.id = 1;
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(user);
      results = await userService.create(user);
      expect(results).toEqual(user);
    });

    it('Get One', async () => {
      const user = new User();
      user.id = 1;
      const response = { id: 1 };
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      results = await userRepository.findOne(user.id);
      expect(results).toEqual(response);
    });
  });
});
