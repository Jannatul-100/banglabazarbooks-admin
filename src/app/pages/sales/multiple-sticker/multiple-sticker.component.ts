import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from '../../../services/common/order.service';
import { Order } from '../../../interfaces/common/order.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { UiService } from '../../../services/core/ui.service';

@Component({
  selector: 'app-multiple-sticker',
  templateUrl: './multiple-sticker.component.html',
  styleUrls: ['./multiple-sticker.component.scss']
})
export class MultipleStickerComponent implements OnInit, OnDestroy {
  invoices: Order[] = [];
  ids: string[] = [];
  isLoading = true;

  private subDataOne: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    private uiService: UiService,
    private router: Router
  ) {}

  ngOnInit() {
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
          this.invoices = res.data;
          this.isLoading = false;
          // Auto print after a short delay
          setTimeout(() => {
            this.printInvoice();
          }, 1000);
        } else {
          this.uiService.warn(res.message);
          this.isLoading = false;
        }
      },
      error: err => {
        this.spinner.hide();
        this.isLoading = false;
        console.log(err);
      }
    });
  }

  printInvoice(): void {
    this.checkImagesLoadedPeriodically();
  }

  private checkImagesLoadedPeriodically() {
    let attempts = 0;
    const intervalId = setInterval(() => {
      attempts++;
      const container = document.querySelector('.preview-container');
      
      if (container) {
        clearInterval(intervalId);
        const images = document.querySelectorAll('img');
        const check = () => Array.from(images).every((img) => img.complete);
        if (check()) {
          window.print();
        } else {
          const imgInterval = setInterval(() => {
            if (check()) {
              clearInterval(imgInterval);
              window.print();
            }
          }, 100);
          setTimeout(() => {
            clearInterval(imgInterval);
            window.print();
          }, 800);
        }
      } else if (attempts > 50) { // Max 5 seconds
        clearInterval(intervalId);
        window.print();
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }
}
