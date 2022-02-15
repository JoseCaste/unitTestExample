import { Repository } from "typeorm";
import { Document } from "../../models/document.entity";

export interface DocumentRepository extends Repository<Document>{
    
}