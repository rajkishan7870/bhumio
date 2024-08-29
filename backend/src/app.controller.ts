import { Controller, Get, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { AppService } from './app.service';
import { diskStorage } from 'multer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api/load')
  async getPdf(@Res() res: Response) {
    const file = await createReadStream('./src/example.pdf');
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="example.pdf"',
    });
    console.log(file)
    file.pipe(res);
  }


  @Post('/api/save')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', 
      filename: (req, file, callback) => {
        const filename = 'example.pdf';
        callback(null, filename);
      },
    }),
  }))
  uploadFile(@UploadedFile() file) {
    console.log('File uploaded:', file);
    return { message: 'File uploaded successfully' };
  }
}
