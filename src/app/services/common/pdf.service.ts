import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'src/app/services/common/pdf-fonts.js'; // Importing fonts from local file
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() { }

  generatePdf(data: any[], filename: string) {
    console.log(data)
    const documentDefinition: any = {
      content: [
        { text: 'User Data', style: 'header' },
        { table: { body: data, style: 'pBn'} }
      ],
      defaultStyle: {
        font: 'Poppins', // Set default font
        fontSize: 9,
      },
      styles: this.pdfMakeStyleObject,

    };

    pdfMake.createPdf(documentDefinition).download(filename);
  }

  get pdfMakeStyleObject(): object {
    return {
      p: {
        font: 'Poppins',
        fontSize: 9,
      },
      pBn: {
        font: 'Nikosh',
        fontSize: 9,
        lineHeight: 2,
      },
      tableHead: {
        font: 'Poppins',
        fontSize: 9,
        bold: true,
        margin: [5, 2],
      },
      tableBody: {
        font: 'Poppins',
        fontSize: 9,
        margin: [5, 2],
      },
      gapY: {
        margin: [0, 8],
      },
      gapXY: {
        margin: [0, 40],
      },
    };
  }
}
