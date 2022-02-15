import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../../models/document.entity';
import { DocumentRepository } from './document.repository';

@Injectable()
export class DocumentService {

    constructor(@InjectRepository(Document) private documentRepository:DocumentRepository){}

    async getAll(): Promise<Document[]>{
        return await this.documentRepository.find();
    }
}
