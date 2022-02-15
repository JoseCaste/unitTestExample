import { Controller, Get, Res } from '@nestjs/common';
import { DocumentService } from './document.service';
import { Document } from 'src/models/document.entity';
@Controller('document')
export class DocumentController {

    constructor(private documentService: DocumentService){}
    @Get()
    getDocs(): Promise<Document[]>{
        console.log("HI");
        this.documentService.getAll().then(data=> console.log(data));
        return this.documentService.getAll();
    }
}
