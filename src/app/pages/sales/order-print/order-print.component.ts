import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from '../../../services/common/order.service';
import { Order } from '../../../interfaces/common/order.interface';
import { UtilsService } from '../../../services/core/utils.service';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { DatePipe } from '@angular/common';
import * as pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from '../order-details/pdf-fonts';
import { NgxSpinnerService } from 'ngx-spinner';
import { UiService } from '../../../services/core/ui.service';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

(pdfMake as any).fonts = {
  Poppins: {
    normal: 'Poppins-Regular.ttf',
    bold: 'Poppins-SemiBold.ttf',
    italics: 'Poppins-Italic.ttf',
    bolditalics: 'Poppins-Italic.ttf',
  },
  Sutonny: {
    normal: 'sutonny.ttf',
    bold: 'sutonny.ttf',
    italics: 'sutonny.ttf',
    bolditalics: 'sutonny.ttf',
  },
  Nikosh: {
    normal: 'nikosh.ttf',
    bold: 'nikosh.ttf',
    italics: 'nikosh.ttf',
    bolditalics: 'nikosh.ttf',
  },
};

@Component({
  selector: 'app-order-print',
  templateUrl: './order-print.component.html',
  styleUrls: ['./order-print.component.scss'],
  providers: [PricePipe, DatePipe]
})
export class OrderPrintComponent implements OnInit, OnDestroy {

  orders: Order[] = [];
  ids: string[] = [];
  isLoading = true;

  // Subscriptions
  private subDataOne: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private utilsService: UtilsService,
    private pricePipe: PricePipe,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private uiService: UiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params['ids']) {
        this.ids = params['ids'].split(',');
        this.getInvoices();
      } else {
        this.uiService.warn('No orders selected for printing');
        this.router.navigate(['/sales/all-orders']);
      }
    });
  }

  getInvoices() {
    this.spinner.show();
    this.subDataOne = this.orderService.generateInvoices(this.ids).subscribe({
      next: res => {
        this.spinner.hide();
        if (res.success) {
          this.orders = res.data;
          this.isLoading = false;
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: err => {
        this.spinner.hide();
        console.log(err);
      }
    });
  }

  async generatePdf() {
    if (this.orders.length === 0) return;

    const documentDefinition: any = {
      content: [],
      defaultStyle: {
        font: 'Poppins',
      },
      styles: this.pdfMakeStyleObject
    };

    const logo = await this.getProfilePicObjectPdf();
    
    let sundarbanLogo = null;
    let pathaoLogo = null;
    
    try {
      sundarbanLogo = await this.getBase64ImageFromURL('/assets/images/sundorban.png');
    } catch (e) {
      console.log('Error loading Sundarban logo', e);
    }
    
    try {
      pathaoLogo = await this.getBase64ImageFromURL('/assets/images/Pathao_Courier_Black.png');
    } catch (e) {
      console.log('Error loading Pathao logo', e);
    }

    for (let i = 0; i < this.orders.length; i++) {
      const order = this.orders[i];
      const orderContent = await this.getInvoiceDocument(order, logo, sundarbanLogo, pathaoLogo);
      documentDefinition.content.push(...orderContent);

      // Add page break if not last
      if (i < this.orders.length - 1) {
        documentDefinition.content.push({ text: '', pageBreak: 'after' });
      }
    }

    pdfMake.createPdf(documentDefinition as any).print();
  }

  private async getInvoiceDocument(order: Order, logo: any, sundarbanLogo: any, pathaoLogo: any) {
    return [
      {
        columns: [
          logo,
          [
            {
              width: 'auto',
              text: `www.banglabazarbooks.com`,
              style: 'p',
            },
            {
              width: 'auto',
              text: `38, Bangla Bazar(Opposite of Kajol Brothers) , Dhaka -1100`,
              style: 'p',
            },
            {
              width: 'auto',
              text: `Telephone: 01784093014`,
              style: 'p',
            },
            {
              width: 'auto',
              text: `Email: banglabazarbooks@gmail.com`,
              style: 'p',
            },
          ],
          [
            {
              width: '*',
              text: [
                `Invoice ID: `,
                {
                  text: 'SL-' + order.orderId,
                  bold: true,
                },
              ],
              style: 'p',
              alignment: 'right',
            },
            {
              width: '*',
              text: `${this.utilsService.getDateString(new Date(), 'll')} (${order.phoneNo})`,
              style: 'p',
              alignment: 'right',
            },
          ],
          {
            qr: order.orderId,
            fit: 70,
            alignment: 'right',
          }
        ],
        columnGap: 16,
      }, // END TOP INFO SECTION
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 5,
            x2: 535,
            y2: 5,
            lineWidth: 0.5,
            lineColor: '#E8E8E8',
          },
        ],
      }, // END TOP INFO BORDER
      (order.courierData?.providerName === 'Sundarban Courier'
        ? (sundarbanLogo ? { image: sundarbanLogo, width: 120, alignment: 'center', margin: [0, 10, 0, 10] } : { text: 'Sundarban Courier', style: 'p', fontSize: 16, bold: true, alignment: 'center', margin: [0, 10, 0, 10] })
        : (pathaoLogo ? { image: pathaoLogo, width: 120, alignment: 'center', margin: [0, 10, 0, 10] } : { text: 'Cash on Delivery', style: 'p', fontSize: 16, bold: true, alignment: 'center', margin: [0, 10, 0, 10] })
      ), // COURIER LOGO/TEXT
      {
        columns: [
          [
            {
              width: 'auto',
              text: `Order Info:`,
              style: 'p',
              margin: [0, 8, 0, 0],
            },
            {
              width: 'auto',
              text: [
                `Order Id: `,
                {
                  text: '#' + order.orderId,
                  bold: true,
                },
              ],
              style: 'p',
            },
            {
              width: 'auto',
              text: `Date Added: ${this.utilsService.getDateString(new Date(order.createdAt), 'll')}`,
              style: 'p',
            },
            {
              width: 'auto',
              text: [
                `Payment Status: `,
                {
                  text: order.paymentStatus,
                  bold: true,
                },
              ],
              style: 'p',
            },
            {
              width: 'auto',
              text: [
                `Total Product: `,
                {
                  text: `${order.orderedItems.length}Items`,
                  bold: true,
                },
              ],
              style: 'p',
            },
          ],
          {
            width: '*',
            alignment: 'left',
            text: '',
          }, // Middle Space for Make Column Left & Right
          [
            {
              width: 'auto',
              text: `Delivery Address:`,
              style: ['pBn'],
              margin: [0, 8, 0, 0],
            },
            {
              width: 'auto',
              text: [
                `Name: `,
                {
                  text: order.name,
                  bold: true,
                },
              ],
              style: 'pBn',
            },
            {
              width: 'auto',
              text: `Address: ${order.shippingAddress}`,
              style: ['pBn'],
            },
            {
              width: 'auto',
              text: [
                `Phone: `,
                {
                  text: order.phoneNo,
                  bold: true,
                },
              ],
              style: 'p',
            },
            {
              width: 'auto',
              text: order.preferredDate && order.preferredTime
                ? `(${this.utilsService.getDateString(order.preferredDate, 'll')} তারিখ ${order.preferredTime} সময়ের মধ্যে ডেলিভারি দিবেন)`
                : '',
              style: ['pBn'],
            },
          ],
        ],
        columnGap: 16,
      },
      {
        style: 'gapY',
        columns: [this.getItemTable(order)],
      }, // END ITEM TABLE SECTION
      {
        style: 'gapY',
        columns: [
          [
            {
              width: 'auto',
              text: [
                `Note: `,
                {
                  text: '#' + (order.note && order.note !== null ? order.note : 'N/A'),
                  bold: true,
                },
              ],
              style: 'pBn',
            },
          ],
          {
            width: '*',
            alignment: 'left',
            text: '',
          }, // Middle Space for Make Column Left & Right
          [
            {
              width: 'auto',
              text: [
                {
                  text: order.productDiscount && order.productDiscount > 0
                    ? `You Saved ${order.productDiscount} TK from banglabazarbooks.com`
                    : '',
                  bold: true,
                },
              ],
              style: 'p',
            },
            this.getCalculationTable(order),
          ],
        ],
      }, // END CALCULATION SECTION
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 5,
            x2: 535,
            y2: 5,
            lineWidth: 0.5,
            lineColor: '#E8E8E8',
          },
        ],
      }, // END TOP INFO BORDER
      {
        style: 'gapXY',
        columns: [
          [
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0,
                  y1: 5,
                  x2: 100,
                  y2: 5,
                  lineWidth: 1,
                  lineColor: '#767676',
                },
              ],
            },
            {
              width: 'auto',
              text: [`Received By `],
              style: 'p',
              margin: [22, 10],
            },
          ],
          {
            width: '*',
            alignment: 'left',
            text: '',
          }, // Middle Space for Make Column Left & Right
          [
            {
              alignment: 'right',
              canvas: [
                {
                  type: 'line',
                  x1: 0,
                  y1: 5,
                  x2: 100,
                  y2: 5,
                  lineWidth: 1,
                  lineColor: '#767676',
                },
              ],
            },
            {
              width: '100',
              text: [`Authorized By `],
              style: 'p',
              alignment: 'right',
              margin: [22, 10],
            },
          ],
        ],
      },
      {
        text: 'Thank you for choosing Bangla Bazar Books',
        style: 'p',
        alignment: 'center',
        margin: [0, 10],
      },
    ];
  }

  getItemTable(order: Order) {
    return {
      table: {
        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: this.dataTableForPdfMake(order),
      },
    };
  }

  dataTableForPdfMake(order: Order) {
    const tableHead = [
      {
        text: 'SL',
        style: 'tableHead',
        fillColor: '#DEDEDE',
        borderColor: ['#eee', '#eee', '#eee', '#eee'],
      },
      {
        text: 'Product Name',
        style: 'tableHead',
        fillColor: '#DEDEDE',
        borderColor: ['#eee', '#eee', '#eee', '#eee'],
      },
      {
        text: 'Unit Price',
        style: 'tableHead',
        fillColor: '#DEDEDE',
        borderColor: ['#eee', '#eee', '#eee', '#eee'],
      },
      {
        text: 'Discount',
        style: 'tableHead',
        fillColor: '#DEDEDE',
        borderColor: ['#eee', '#eee', '#eee', '#eee'],
      },
      {
        text: 'Dis.Amount',
        style: 'tableHead',
        fillColor: '#DEDEDE',
        borderColor: ['#eee', '#eee', '#eee', '#eee'],
      },
      {
        text: 'Quantity',
        style: 'tableHead',
        fillColor: '#DEDEDE',
        borderColor: ['#eee', '#eee', '#eee', '#eee'],
      },
      {
        text: 'Total',
        style: 'tableHead',
        fillColor: '#DEDEDE',
        borderColor: ['#eee', '#eee', '#eee', '#eee'],
      },
    ];

    const finalTableBody = [tableHead];
    order.orderedItems.forEach((m, i) => {
      const res = [
        {
          text: i + 1,
          style: 'tableBody',
          borderColor: ['#eee', '#eee', '#eee', '#eee'],
        },
        {
          text: m.name + (m.publisher?.name ? `\n(${m.publisher?.name})` : ''),
          style: ['pBn'],
          borderColor: ['#eee', '#eee', '#eee', '#eee'],
        },
        {
          text: m.regularPrice + 'TK',
          style: 'tableBody',
          borderColor: ['#eee', '#eee', '#eee', '#eee'],
        },
        {
          text: m.discountType === 1 ? `${m.discountAmount}%` : (m.regularPrice && m.regularPrice > m.unitPrice ? `${Math.round(((m.regularPrice - m.unitPrice) / m.regularPrice) * 100)}%` : '0%'),
          style: 'tableBody',
          borderColor: ['#eee', '#eee', '#eee', '#eee'],
        },
        {
          text: `${(m.regularPrice - m.unitPrice) * m.quantity}TK`,
          style: 'tableBody',
          borderColor: ['#eee', '#eee', '#eee', '#eee'],
        },
        {
          text: m.quantity,
          style: 'tableBody',
          borderColor: ['#eee', '#eee', '#eee', '#eee'],
        },
        {
          text: m.regularPrice * m.quantity + 'TK',
          style: 'tableBody',
          borderColor: ['#eee', '#eee', '#eee', '#eee'],
        },
      ];
      finalTableBody.push(res as any);
    });

    return finalTableBody;
  }

  getCalculationTable(order: Order) {
    return {
      table: {
        widths: ['*', '*'],
        body: [
          [
            {
              text: 'SubTotal',
              style: 'tableHead',
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            },
            {
              text: `${order.subTotal} TK`,
              style: 'tableBody',
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            },
          ],
          [
            {
              text: 'Discount',
              style: 'tableHead',
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            },
            {
              text: `-${(order.subTotal + order.deliveryCharge) - order.grandTotal} TK`,
              style: 'tableBody',
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            },
          ],
          [
            {
              text: 'Delivery Charge',
              style: 'tableHead',
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            },
            {
              text: `${order.deliveryCharge} TK`,
              style: 'tableBody',
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            },
          ],
          [
            {
              text: 'Grand Total',
              style: 'tableHead',
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            },
            {
              text: `${order.grandTotal} TK`,
              style: 'tableBody',
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            },
          ],
        ],
      },
    };
  }

  async getProfilePicObjectPdf() {
    const logo = await this.getBase64ImageFromURL('/assets/images/logo/logo2.png');
    return {
      image: logo,
      width: 50,
      alignment: 'left',
    };
  }

  getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }

  get pdfMakeStyleObject(): any {
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

  ngOnDestroy(): void {
    if (this.subDataOne) this.subDataOne.unsubscribe();
  }

}
