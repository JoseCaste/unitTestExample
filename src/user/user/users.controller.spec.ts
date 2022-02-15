import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../models/user.entity';
import { UserService } from './users.service';

describe('ContactsController', () => {
  let userService: UserService;
  let userRepository:Repository<User>;
  let results;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers:[{provide:getRepositoryToken(User),useClass:Repository},
        UserService]
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository=module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('Definiciones',()=>{
    
    it('should be defined', () => {
      expect(userService).toBeDefined();
    });

  });

  describe("Servicios",()=>{

    it('FindAll',async ()=>{
      const users= new Array<User>();
      const user= new User();
      user.id=1;
      users.push(user);
      const response= [{id: 1}];
      jest.spyOn(userRepository,'find').mockResolvedValueOnce(users);
      results=await userService.findAll();
      expect(results).toEqual(response);
    });

  });
});

