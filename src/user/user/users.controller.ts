import { Controller, Get, HttpStatus, Post, Query, Req, Res, Response, StreamableFile } from '@nestjs/common';
import { User } from '../../models/user.entity';
import { UserService } from './users.service';
import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';
import { zip } from 'zip-a-folder';
import { join } from 'path';

@Controller('contacts')
export class ContactsController {
    constructor(private userService: UserService){}
    
    @Get()
    index(): Promise<User[]> {
      return this.userService.findAll();
    }   
    @Post()
    create(@Req() req){
      console.log(req.body);
      
      return this.userService.create(req.body)
    }
  
  @Get("/report/create/")
  async createReport(@Query("name") name:string ,@Res()res){
    let user = await this.userService.findOne(name);
    if(user != undefined){
      for (let index = 0; index < 100; index++) {
        let doc = new PDFDocument();
        doc.pipe(fs.createWriteStream('./pdfs/'+user.name+user.lastName+'.'+index+'.pdf'));
        doc.text(name, 150, 150);
        doc
        .fillColor('blue')
        .fontSize(17)
        .text("20%", 150, 160);
        doc.end(); 
      }
      res.status(200).send({message:'Lote de reportes creado'});
    }else res.status(404).send({message:'Usuario no encontrado'})    
  }
  @Get('pdf')
  async pdf(@Query('name') name: string,@Res() res) {
    let user = await this.userService.findOne(name);
    if(user==undefined || name == ''){
      res.status(HttpStatus.NOT_FOUND).json("Nombre de usuario no válido");
      return;
    }else{
      await zip('./pdfs/', `./zip/${user.name}${user.lastName}.zip`).then(success=>{
        for (let index = 0; index < 100; index++) {
          const path=`./pdfs/${user.name}${user.lastName}.${index}.pdf`;
          fs.unlink(path,(err)=>{
            if(err) return; 
          })
        }
      });
      return res.status(201).send({message:'Zip creado'});
    }
  }
  @Get('/download')
  async download(@Query("name") name:string,
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    let user = await this.userService.findOne(name);
    if(user==undefined || name == ''){
      res.status(HttpStatus.NOT_FOUND).json("Nombre de usuario no válido");
      return;
    }else{
      const file = fs.createReadStream(join(process.cwd(), `./zip/${user.name}${user.lastName}.zip`));
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=${user.name}${user.lastName}.zip`,
      });
      return new StreamableFile(file);
    }
  }
}
