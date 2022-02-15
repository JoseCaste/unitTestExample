import { Module } from '@nestjs/common';
import { DocumentService } from './document/document.service';
import { DocumentController } from './document/document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from 'src/models/document.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Document])],
  providers: [DocumentService,Document],
  controllers: [DocumentController],
  exports:[Document]
})
export class DocumentModule {}
