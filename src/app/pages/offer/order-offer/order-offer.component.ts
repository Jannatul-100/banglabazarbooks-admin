import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {Select} from "../../../interfaces/core/select";
import {DISCOUNT_TYPES} from "../../../core/utils/app-data";
import {OrderOffer} from "../../../interfaces/common/order-offer.interface";
import {OrderOfferService} from "../../../services/common/order-offer.service";


@Component({
  selector: 'app-order-offer',
  templateUrl: './order-offer.component.html',
  styleUrls: ['./order-offer.component.scss']
})
export class OrderOfferComponent implements OnInit, OnDestroy {
  dataForm?: FormGroup;

  orderOffer: OrderOffer;
  // Static Data
  discountTypes: Select[] = DISCOUNT_TYPES;
  // Store Data from param
  id?: string;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    public router: Router,
    private orderOfferService: OrderOfferService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    // INIT FORM
    this.initFormGroup();

    // GET DATA
    this.getOrderOffer();
  }

  /**
   * FORMS METHODS
   * initFormGroup()
   * setFormData()
   * onSubmit()
   */
  private initFormGroup() {
    this.dataForm = this.fb.group({
      firstOrderDiscountAmount: [null],
      firstOrderMinAmount: [null],
      firstOrderDiscountType: [null],
      amountOrderDiscountAmount: [null],
      amountOrderDiscountType: [null],
      amountOrderMinAmount: [null],
      amount2OrderDiscountAmount: [null],
      amount2OrderDiscountType: [null],
      amount2OrderMinAmount: [null],
      amount3OrderDiscountAmount: [null],
      amount3OrderDiscountType: [null],
      amount3OrderMinAmount: [null],
      appsOrderDiscountAmount: [null],
      appsOrderDiscountType: [null],
      appsOrderMinAmount: [null],
      monthOrderDiscountAmount: [null],
      monthOrderDiscountType: [null],
      monthOrderMinAmount: [null],
      monthOrderValue: [null],
    });
  }

  private setFormData() {
    this.dataForm.patchValue(this.orderOffer);
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    this.addOrderOffer(this.dataForm.value);
  }

  /**
   * HTTP REQ HANDLE
   * addOrderOffer()
   * getOrderOffer()
   */
  private addOrderOffer(data: any) {
    this.spinner.show();
    this.subDataOne = this.orderOfferService
      .addOrderOffer(data)
      .subscribe({
        next:res => {
          this.uiService.success(res.message);
          this.spinner.hide();
        }
        ,
        error: err => {
          this.spinner.hide();
          console.log(err);
        }
      });
  }

  private getOrderOffer() {
    this.spinner.show();
    this.subDataTwo = this.orderOfferService.getOrderOffer().subscribe(
      (res) => {
        this.orderOffer = res.data;
        this.spinner.hide();
        this.setFormData();
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
  }

}
