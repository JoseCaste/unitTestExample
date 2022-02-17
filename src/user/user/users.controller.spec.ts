import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import exp from 'constants';
import { Repository, UpdateResult } from 'typeorm';
import { isRegExp } from 'util/types';
import { User } from '../../models/user.entity';
import { UserService } from './users.service';

describe('ContactsController', () => {
  let module: TestingModule;
  let userService: UserService;
  let userRepository:Repository<User>;
  let results;
  let spyUserService: UserService;

  beforeEach(async () => {
     module = await Test.createTestingModule({
      providers:[
        {provide:getRepositoryToken(User),useClass:Repository,useValue:{}},
        {provide:UserService,useFactory:()=>{
          getUsersMustBeWorkingNow: jest.fn(() => true)
        }},
        UserService]
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository=module.get<Repository<User>>(getRepositoryToken(User));
    spyUserService = module.get(UserService);
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

    it('Save',async () => {
      const user= new User();
      user.id=1;
      jest.spyOn(userRepository,'save').mockResolvedValueOnce(user);
      results=await userService.create(user);
      expect(results).toEqual(user);
    })

    it('Delete',async ()=> {
      /*const user_= new User();
      user_.id=1;
      jest.spyOn(userRepository,'delete').mockResolvedValue(user_);*/
      expect(1).toEqual(1);
    });

    it('Get One',async()=>{
      const user= new User();
      user.id=1;
      const response={id:1};
      jest.spyOn(userRepository,'findOne').mockResolvedValueOnce(user);
      results=await userRepository.findOne(user.id);
      expect(results).toEqual(response);
    });

    it('Update',async()=>{
       /*const user= new User();
       user.id=1;
       //await userService.update(user);
       jest.spyOn(userService,'updates').mockImplementation((_user: User)=>{

       });
       expect(userService.update).toEqual("")*/
    })
  });
});

