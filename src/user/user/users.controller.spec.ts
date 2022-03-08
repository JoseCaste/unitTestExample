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

    describe('Donwload zip Test', () => {
      it('Regrasa un error - Cuando el metodo findOne recibe un parametro vacío', async () => {
        const value = 'No se encontró el usuario';
        try {
          jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
          results = await userService.downloadZip('Jose');
        } catch (error) {
          results = error.response.message;
        }
        expect(results).toEqual(value);
      });
      it('Regrasa un error - Cuando un recibe un parámetro ditinto de undefined pero vacío', async () => {
        const value = 'Se debe proporcionar un nombre';
        try {
          //jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
          results = await userService.downloadZip('');
        } catch (error) {
          results = error.response.message;
        }
        expect(results).toEqual(value);
      });
      it('Prueba de éxito - Cuando se recibe un parámetro válido', async () => {
        const user = new User();
        user.id = 1;
        user.lastName = 'Cstellanos';
        user.name = 'Jose';
        try {
          jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
          results = await userService.downloadZip('Sj');
        } catch (error) {
          results = error.response.message;
        }
        expect(results.stream.path).toEqual(
          '/home/jjcastellanosg/Documents/git/unitTestExample/zip/JoseCstellanos.zip',
        );
      });
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
