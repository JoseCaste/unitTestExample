import { HttpStatus, Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { User } from '../../models/user.entity';
import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';
import { zip } from 'zip-a-folder';
import { join } from 'path';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(name: string): Promise<User> {
    return await this.userRepository.findOne({ name: name });
  }
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async create(User: User): Promise<User> {
    return await this.userRepository.save(User);
  }

  async updates(user: User): Promise<UpdateResult> {
    return await this.userRepository.update(user.id, user);
  }

  async delete(user: User): Promise<DeleteResult> {
    const foundNote = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (foundNote) {
      await this.userRepository.delete(foundNote);
    }
    return null;
  }
  async createLote(name: string): Promise<HttpStatus> {
    const user = await this.userRepository.findOne({ name: name });
    if (user != undefined) {
      for (let index = 0; index < 100; index++) {
        const doc = new PDFDocument();
        doc.pipe(
          fs.createWriteStream(
            './pdfs/' + user.name + user.lastName + '.' + index + '.pdf',
          ),
        );
        doc.text(name, 150, 150);
        doc.fillColor('blue').fontSize(17).text('20%', 150, 160);
        doc.end();
      }
      return HttpStatus.CREATED;
    } else return HttpStatus.BAD_REQUEST;
  }
  async createZip(name: string): Promise<HttpStatus> {
    const user = await this.userRepository.findOne({ name: name });
    if (user == undefined || name == '') {
      //res.status(HttpStatus.NOT_FOUND).json('Nombre de usuario no válido');
      return HttpStatus.NOT_FOUND;
    } else {
      await zip('./pdfs/', `./zip/${user.name}${user.lastName}.zip`).then(
        (success) => {
          for (let index = 0; index < 100; index++) {
            const path = `./pdfs/${user.name}${user.lastName}.${index}.pdf`;
            fs.unlink(path, (err) => {
              if (err) return;
            });
          }
        },
      );
      return HttpStatus.CREATED; //res.status(201).send({ message: 'Zip creado' });
    }
  }
  async downloadZip(name: string): Promise<StreamableFile> {
    try {
      const user = await this.userRepository.findOne({ name: name });

      if (user == undefined || name == '') {
        return undefined;
      } else {
        const file = fs.createReadStream(
          join(process.cwd(), `./zip/${user.name}${user.lastName}.zip`),
        );
        return new StreamableFile(file);
      }
    } catch (e) {
      throw new NotFoundError(e);
    }
  }
}
