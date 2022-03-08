import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  Response,
  StreamableFile,
} from '@nestjs/common';
import { User } from '../../models/user.entity';
import { UserService } from './users.service';
import { zip } from 'zip-a-folder';
import { join } from 'path';
import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';

@Controller('contacts')
export class ContactsController {
  constructor(private userService: UserService) {}

  @Get()
  index(): Promise<User[]> {
    this.userService.findOne('Josessas');
    return this.userService.findAll();
  }
  @Post()
  create(@Req() req) {
    console.log(req.body);

    return this.userService.create(req.body);
  }

  @Get('/report/create/')
  async createReport(@Query('name') name: string, @Res() res) {
    const user = await this.userService.findOne(name);
    const status = await this.userService.createLote(user.name);
    if (status == HttpStatus.CREATED)
      res
        .status(HttpStatus.CREATED)
        .send({ message: 'Lote de reportes creado' });
    else
      res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Usuario no encontrado' });
  }
  @Get('pdf')
  async pdf(@Query('name') name: string, @Res() res) {
    /*const user = await this.userService.findOne(name);
    if (user == undefined || name == '') {
      res.status(HttpStatus.NOT_FOUND).json('Nombre de usuario no válido');
      return;
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
      return res.status(201).send({ message: 'Zip creado' });
    }*/
    const status = await this.userService.createZip(name);
    if (status == HttpStatus.CREATED)
      res
        .status(HttpStatus.CREATED)
        .send({ message: 'Zip generado exitosamente' });
    else
      res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Usuario no encontrado' });
  }
  @Get('/download')
  async download(
    @Query('name') name: string,
    @Response({ passthrough: true }) res,
  ): Promise<any> {
    /*const user = await this.userService.findOne(name);
    if (user == undefined || name == '') {
      res.status(HttpStatus.NOT_FOUND).json('Nombre de usuario no válido');
      return;
    } else {
      const file = fs.createReadStream(
        join(process.cwd(), `./zip/${user.name}${user.lastName}.zip`),
      );
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=${user.name}${user.lastName}.zip`,
      });
      return new StreamableFile(file);
    }*/
    const file_ = await this.userService.downloadZip(name);
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=resources.zip`,
    });
    return file_;
  }
}
