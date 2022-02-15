import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository ,UpdateResult, DeleteResult} from 'typeorm';
import { User } from '../../models/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findOne(name:string) :Promise<User>{
        return await this.userRepository.findOne({name:name})
    }
    async  findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async  create(User: User): Promise<User> {
        return await this.userRepository.save(User);
    }

    async update(User: User): Promise<UpdateResult> {
        return await this.userRepository.update(User.id, User);
    }

    async delete(id): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }
}
