import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { User } from '../../models/user.entity';
import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';
import { zip } from 'zip-a-folder';
import { join } from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(name: string): Promise<User> {
    const user = await this.userRepository.findOne({ name: name });
    console.log(user);
    return user;
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
      //res.status(HttpStatus.NOT_FOUND).json('Nombre de usuario no v??lido');
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
  async getPath(name: string, lastName: string) {
    //https://riuma.uma.es/xmlui/static/pdf/politica-riuma_es.pdf
    return join(process.cwd(), `./zip/${name}${lastName}.zip`);
  }
  async downloadZip(name: string): Promise<StreamableFile> {
    try {
      if (name != '') {
        const user = await this.userRepository.findOne({ name: name });
        if (!user) throw new NotFoundException('', 'No se encontr?? el usuario');

        const file = fs.createReadStream(
          //join(process.cwd(), `./zip/${user.name}${user.lastName}.zip`),
          await this.getPath(user.name, user.lastName),
        );
        const value = new StreamableFile(file);
        console.log(process.cwd());
        console.log(value);
        return value;
      } else throw new NotFoundException('', 'Se debe proporcionar un nombre');
    } catch (e) {
      throw new NotFoundException('', e.message);
    }
  }
}
