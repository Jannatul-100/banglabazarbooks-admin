import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProductListComponent } from '../../../shared/dialog-view/product-list/product-list.component';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../../interfaces/common/product.interface';
import { UtilsService } from '../../../services/core/utils.service';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { UiService } from '../../../services/core/ui.service';
import {
  CITIES,
  DELIVERY_TIMES,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_TYPES,
  COURIER_PROVIDERS,
} from '../../../core/utils/app-data';
import { Select } from '../../../interfaces/core/select';
import { OrderService } from '../../../services/common/order.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmDialogComponent } from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {
  DiscountType,
  Order,
} from '../../../interfaces/common/order.interface';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { OrderStatus } from '../../../enum/order.enum';
import { MatSelectChange } from '@angular/material/select';
import { VariationNormalizePipe } from '../../../shared/pipes/variation-normalize.pipe';
import {Division} from "../../../interfaces/common/division.interface";
import {FilterData} from "../../../interfaces/core/filter-data";
import {DivisionService} from "../../../services/common/division.service";
import {AreaService} from "../../../services/common/area.service";
import {ZoneService} from "../../../services/common/zone.service";

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss'],
  providers: [PricePipe, VariationNormalizePipe],
})
export class AddOrderComponent implements OnInit, OnDestroy {
  // Static Data
  cities: string[] = CITIES;
  paymentTypes: any[] = PAYMENT_TYPES;
  paymentStatus: Select[] = PAYMENT_STATUS;
  orderStatus: Select[] = ORDER_STATUS;
  divisions: Division[] = [];
  areas: any[] = [];
  zones: any[] = [];
  allDeliverTimes: any[] = DELIVERY_TIMES;
  preferredTime: string = null;
  courierProviders: Select[] = COURIER_PROVIDERS;

  // Store Data
  id?: string;
  order?: Order;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subRouteOne: Subscription;
  private subRouteTwo: Subscription;
  private subDivisionData: Subscription;
  selectedProducts: Product[] = [];

  // Calculation data
  deliveryCharge: number = 50;
  discount: number = 0;
  additionalDiscount: number = 0;

  // Discount Types
  discountTypes: DiscountType[] = [];

  rawChatText: string = '';

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    protected pricePipe: PricePipe,
    private variationNormalizePipe: VariationNormalizePipe,
    private uiService: UiService,
    private orderService: OrderService,
    private divisionService: DivisionService,
    private areaService: AreaService,
    private zoneService: ZoneService,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getOrderById();
      }
      // GET PAGE FROM QUERY PARAM
      this.subRouteTwo = this.activatedRoute.queryParamMap.subscribe((qParam) => {
        if (qParam && qParam.get('id')) {
          this.id = qParam.get('id');
          this.getOrderById();
        }
      });
    });

    this.getAllDivision();
  }

  /**
   * INIT FORM
   * initDataForm()
   * setDataForm()
   * onSubmit()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      phoneNo: [null, Validators.required],
      email: [null],
      // city: [null],
      division: [null],
      area: [null],
      zone: [null],
      courier: [null],
      note: [null],
      shippingAddress: [null, Validators.required],
      paymentType: [this.paymentTypes[0].value, Validators.required],
      paymentStatus: [this.paymentStatus[0].value, Validators.required],
      orderStatus: [this.orderStatus[0].value, Validators.required],
      // TimeLine
      hasOrderTimeline: [null],
      processingDate: [null],
      shippingDate: [null],
      deliveringDate: [null],
      preferredTime: [null],
      preferredDate: [null],
    });

    this.dataForm.get('courier')?.valueChanges.subscribe(() => {
      this.calculateDynamicDeliveryCharge();
    });
  }

  private setDataForm() {
    if (this.order) {
      this.dataForm.patchValue(this.order);
      this.deliveryCharge = this.order.deliveryCharge;
      this.discount = this.order.discount;
      this.discountTypes = this.order.discountTypes;
      this.preferredTime = this.order.preferredTime;
      this.dataForm.patchValue({ division: this.order?.division?._id });
      // console.log('this.order?.division?._id',this.order?.division?._id)
      if (this.order?.division) {
        this.divisionSelected = this.order?.division;
        this.getAreaByDivision();
      }
      if (this.order?.area) {
        this.dataForm.patchValue({ area: this.order?.area?._id });
        this.areaSelected = this.order?.area;
        this.getZoneByArea();
      }
      if (this.order?.zone) {
        this.dataForm.patchValue({ zone: this.order?.zone?._id });
        this.zoneSelected = this.order?.zone;
      }
      if (this.order?.courierData?.providerName) {
        this.dataForm.patchValue({ courier: this.order.courierData.providerName });
      }
      this.dataForm.patchValue({
        preferredDate: new Date(this.order.preferredDateString),
      });

      if (this.order.hasOrderTimeline) {
        this.dataForm.patchValue({
          processingDate: this.order?.orderTimeline?.processed?.expectedDate,
          shippingDate: this.order?.orderTimeline?.shipped?.expectedDate,
          deliveringDate: this.order?.orderTimeline?.delivered?.expectedDate,
        });
      }

      this.selectedProducts = this.order.orderedItems.map((m) => {
        return {
          _id: m._id,
          name: m.name,
          slug: m.slug,
          images: [m.image],
          costPrice: m.costPrice,
          salePrice: m.regularPrice,
          unitPrice: m.unitPrice,
          regularPrice: m.regularPrice,
          discountAmount: m.discountAmount,
          discountType: m.discountType,
          category: m.category,
          subCategory: m.subCategory,
          publisher: m.publisher,
          brand: m.brand,
          selectedQty: m.quantity,
          unit: m.unit ? m.unit : null,
        } as Product;
      });
      console.log(this.selectedProducts);
    }
  }
  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field');
      this.dataForm.markAllAsTouched();
      return;
    }

    if (this.dataForm.value.courier === 'Sundarban Courier' && this.dataForm.value.paymentType === 'cash_on_delivery') {
      this.uiService.warn('সুন্দরবন কুরিয়ারের ক্ষেত্রে ক্যাশ অন ডেলিভারি প্রযোজ্য নয়।');
      return;
    }

    if (!this.selectedProducts.length) {
      this.uiService.warn('Please select product on cart');
      return;
    }

    // Product Info
    const products = this.selectedProducts.map((m) => {
      return {
        _id: m._id,
        name: m.name,
        slug: m.slug,
        image: m.images && m.images.length ? m.images[0] : null,
        category: {
          _id: m.category?._id,
          name: m.category?.name,
          slug: m.category?.slug,
        },
        subCategory: {
          _id: m.subCategory?._id,
          name: m.subCategory?.name,
          slug: m.subCategory?.slug,
        },
        publisher: {
          _id: m.publisher?._id,
          name: m.publisher?.name,
          slug: m.publisher?.slug,
        },
        brand: {
          _id: m.brand?._id,
          name: m.brand?.name,
          slug: m.brand?.slug,
        },
        author: m.author ? m.author : null,
        regularPrice: this.pricePipe.transform(m, 'regularPrice'),
        unitPrice: this.pricePipe.transform(m, 'salePrice'),
        salePrice: this.pricePipe.transform(m, 'salePrice'),
        quantity: m.selectedQty,
        discountAmount: m.discountAmount,
        discountType: m.discountType,
        costPrice: m.costPrice,
        orderType: (m as any).isPreOrder ? 'pre_order' : 'regular',
        unit: m.unit ? m.unit : null,
      } as any;
    });

    // Discount Types set
    // if (this.additionalDiscount && this.additionalDiscount > 0) {
    //   const hasAdditionalDis = this.discountTypes.find(
    //     (f) => f.type === 'additional'
    //   );
    //   if (hasAdditionalDis) {
    //     const index = this.discountTypes.findIndex(
    //       (f) => f.type === 'additional'
    //     );
    //     this.discountTypes[index].amount = this.additionalDiscount;
    //   } else {
    //     this.discountTypes.push({
    //       type: 'additional',
    //       amount: this.additionalDiscount,
    //     });
    //   }
    // }
    let selectDivision = this.divisions.find((d) => d._id === this.dataForm.value.division);

    const orderData: any = {
      name: this.dataForm.value.name,
      phoneNo: this.dataForm.value.phoneNo,
      email: this.dataForm.value.email,
      // city: this.dataForm.value.city,
      division: selectDivision,
      note: this.dataForm.value.note,
      shippingAddress: this.dataForm.value.shippingAddress,
      paymentType: this.dataForm.value.paymentType,
      paymentStatus: this.dataForm.value.paymentStatus,
      orderStatus: this.dataForm.value.orderStatus,
      orderedItems: products,
      subTotal: this.cartSubTotal,
      deliveryCharge: this.deliveryCharge, // API will add extra charge to this base value
      discount: this.discountTotal,
      hasPreOrder: products.some((p: any) => p.orderType === 'pre_order' || (p as any).isPreOrder),
      grandTotal: this.grandTotal,
      discountTypes: this.discountTypes,
      checkoutDate: this.utilsService.getDateString(new Date()),
      orderTimeline: null,
      hasOrderTimeline: this.dataForm.value.hasOrderTimeline,
      preferredTime: this.dataForm.value.preferredTime,
      preferredDateString: this.utilsService.getDateString(
        this.dataForm.value.preferredDate
      ),
      courierData: this.dataForm.value.courier
        ? {
            ...(this.order?.courierData || {}),
            providerName: this.dataForm.value.courier,
          }
        : null,
      user: this.order?.user ?  this.order?.user: null,


    };


    // console.log("orderData",orderData)
    this.openConfirmDialog(orderData);

  }
  private getAllDivision() {
    let mSelect = {
      name: 1,
    }
    const filter: FilterData = {
      filter: { status: 'publish' },
      select: mSelect,
      pagination: null,
      sort: { name: 1 }
    }

    this.subDivisionData = this.divisionService.getAllDivisions(filter).subscribe(
      (res) => {
        if (res.success) {
          this.divisions = res.data;
        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    )
  }
  /**
   * CALCULATION
   * cartSubTotal()
   * discountTotal()
   * grandTotal()
   */

  // get cartSubTotal(): number {
  //   return this.selectedProducts
  //     .map((t) => {
  //       return this.pricePipe.transform(
  //         t,
  //         'regularPrice',
  //         t.selectedQty
  //       ) as number;
  //     })
  //     .reduce((acc, value) => acc + value, 0);
  // }

  get cartSubTotal(): number {
    return this.selectedProducts.map(t => {
      return this.pricePipe.transform(t, 'regularPrice', t.selectedQty) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  // get discountTotal(): number {
  //   return this.discount + this.additionalDiscount;
  // }

  get grandTotal(): number {
    return Math.round(this.cartSubTotal + (this.deliveryCharge || 0) - this.discountTotal - (this.additionalDiscount || 0));
  }

  calculateDynamicDeliveryCharge(): void {
    if (this.id && this.order && this.order.deliveryCharge !== undefined && this.order.deliveryCharge !== null) {
      // In edit mode with existing charge, don't overwrite on initial load
    }
    const hasFreeDelivery = this.selectedProducts.some((p: any) => p.freeDelivery === true);
    if (hasFreeDelivery) {
      this.deliveryCharge = 0;
      return;
    }

    const bookTotal = Math.max(0, this.cartSubTotal - this.discountTotal);
    const courier = this.dataForm?.get('courier')?.value;
    const isSundarban = courier === 'Sundarban Courier' || (courier && courier.toLowerCase().includes('sundarban'));

    const isDhaka = this.divisionSelected && (
      this.divisionSelected.name?.toLowerCase()?.includes('dhaka') ||
      this.divisionSelected.name?.includes('ঢাকা')
    );

    if (isSundarban) {
      // Sundarban: 0-1000: 60, each additional 1000: +15
      const extra = Math.ceil(Math.max(0, bookTotal - 1000) / 1000) * 15;
      this.deliveryCharge = 60 + extra;
    } else {
      // Pathao / Standard:
      if (isDhaka) {
        // Inside Dhaka: 0-1000: 60, each additional 1000: +15
        const extra = Math.ceil(Math.max(0, bookTotal - 1000) / 1000) * 15;
        this.deliveryCharge = 60 + extra;
      } else {
        // Outside Dhaka: 0-1000: 110, each additional 1000: +20
        const extra = Math.ceil(Math.max(0, bookTotal - 1000) / 1000) * 20;
        this.deliveryCharge = 110 + extra;
      }
    }
  }

  /**
   * CART FUNCTION
   * incrementQty()
   * decrementQty()
   */

  incrementQty(index: number) {
    this.selectedProducts[index].selectedQty =
      this.selectedProducts[index].selectedQty + 1;
    this.calculateDynamicDeliveryCharge();
  }

  decrementQty(index: number) {
    if (this.selectedProducts[index].selectedQty === 1) {
      this.uiService.warn('Minimum quantity is 1');
      return;
    }

    this.selectedProducts[index].selectedQty =
      this.selectedProducts[index].selectedQty - 1;
    this.calculateDynamicDeliveryCharge();
  }

  /**
   * ACTION
   */
  removeProduct(i: number) {
    this.selectedProducts.splice(i, 1);
    this.calculateDynamicDeliveryCharge();
  }
  /**
   * HTTP REQ HANDLE
   * getOrderById()
   *addOrder()
   * updateOrderById()
   */

  private getOrderById() {
    this.spinnerService.show();
    // const select = ''
    this.subRouteTwo = this.orderService.getOrderById(this.id).subscribe(
      (res) => {
        this.spinnerService.hide();
        if (res.success) {
          this.order = res.data;
          this.setDataForm();
        }
      },
      (error) => {
        this.spinnerService.hide();
        console.log(error);
      }
    );
  }

  private addOrder(data: any) {
    this.spinnerService.show();
    this.subDataOne = this.orderService.addOrder(data).subscribe(
      (res) => {
        this.spinnerService.hide();
        if (res.success) {
          this.uiService.success(res.message);
          this.resetValue();
        } else {
          this.uiService.warn(res.message);
        }
      },
      (error) => {
        this.spinnerService.hide();
        console.log(error);
      }
    );
  }

  private updateOrderById(data: any) {
    this.spinnerService.show();
    this.subDataThree = this.orderService
      .updateOrderById(this.order._id, data)
      .subscribe(
        (res) => {
          this.spinnerService.hide();
          if (res.success) {
            this.uiService.success(res.message);
          } else {
            this.uiService.warn(res.message);
          }
        },
        (error) => {
          this.spinnerService.hide();
          console.log(error);
        }
      );
  }

  onAutoFillAI() {
    if (!this.rawChatText) return;
    
    this.spinnerService.show();
    this.orderService.parseRawText(this.rawChatText).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.success && res.data) {
          const { customer, matchedProducts } = res.data;
          
          if (customer.name) this.dataForm.patchValue({ name: customer.name });
          if (customer.phoneNo) this.dataForm.patchValue({ phoneNo: customer.phoneNo });
          if (customer.shippingAddress) this.dataForm.patchValue({ shippingAddress: customer.shippingAddress });
          if (customer.courier) this.dataForm.patchValue({ courier: customer.courier });
          
          if (matchedProducts && matchedProducts.length) {
            // Set default qty
            const products = matchedProducts.map(p => {
              p.selectedQty = 1;
              return p;
            });
            
            // Merge with existing uniquely
            this.selectedProducts = this.utilsService.mergeArrayUnique(
              this.selectedProducts,
              products
            );
            
            this.uiService.success(`Auto-fill matched ${products.length} books!`);
          } else {
            this.uiService.success('Extracted customer details, but no books were matched.');
          }
        }
      },
      error: (err) => {
        this.spinnerService.hide();
        console.log(err);
        this.uiService.warn('Auto-fill failed.');
      }
    });
  }

  get productDiscountTotal(): number {
    return this.selectedProducts
      .map((t) => {
        const regular = this.pricePipe.transform(t, 'regularPrice') as number;
        const sale = this.pricePipe.transform(t, 'salePrice') as number;
        const qty = t.selectedQty || 1;
        return (regular - sale) * qty;
      })
      .reduce((acc, value) => acc + value, 0);
  }

  /**
   * RESET VALUE
   */
  private resetValue() {
    this.formElement.resetForm();
    this.selectedProducts = [];
    this.discountTypes = [];
  }

  /**
   * ON CHANGE
   * onChangeTimeline()
   * onOrderStatusChange()
   */
  onChangeTimeline(event: MatCheckboxChange) {
    if (event.checked === false) {
      this.dataForm.get('processingDate').clearValidators();
      this.dataForm.get('processingDate').updateValueAndValidity();
      this.dataForm.value.processingDate = null;

      this.dataForm.get('shippingDate').clearValidators();
      this.dataForm.get('shippingDate').updateValueAndValidity();
      this.dataForm.value.shippingDate = null;

      this.dataForm.get('deliveringDate').clearValidators();
      this.dataForm.get('deliveringDate').updateValueAndValidity();
      this.dataForm.value.deliveringDate = null;
    }
  }

  onOrderStatusChange(event: MatSelectChange) {
    if (event.value === OrderStatus.DELIVERED) {
      this.dataForm.patchValue({
        paymentStatus: this.paymentStatus[1].value,
      });
    } else {
      this.dataForm.patchValue({
        paymentStatus: this.order.paymentStatus,
      });
    }
  }

  get discountTotal(): number {
    // system discountTypes + additional discount + product discount
    const typeTotal = this.discountTypes?.reduce((acc, d) => acc + (d.amount || 0), 0) || 0;
    return typeTotal + this.additionalDiscount + this.productDiscountTotal;
  }


  /**
   * OPEN COMPONENT DIALOG
   * openConfirmDialog()
   * openProductListDialog()
   */

  public openConfirmDialog(data: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Order',
        message: `Are you sure you want to ${
          this.id ? 'update' : 'add'
        } this order?`,
      },
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        if (this.id) {
          // set Timeline
          if (this.dataForm.value.hasOrderTimeline) {
            if (this.order.orderTimeline) {
              data.orderTimeline = this.order.orderTimeline;
            } else {
              data.orderTimeline = {
                confirmed: {
                  success: false,
                  date: null,
                  expectedDate: null,
                },
                processed: {
                  success: false,
                  date: null,
                  expectedDate: null,
                },
                shipped: {
                  success: false,
                  date: null,
                  expectedDate: null,
                },
                delivered: {
                  success: false,
                  date: null,
                  expectedDate: null,
                },
                canceled: {
                  success: false,
                  date: null,
                  expectedDate: null,
                },
                refunded: {
                  success: false,
                  date: null,
                  expectedDate: null,
                },
              };
            }

            if (this.dataForm.value.orderStatus === OrderStatus.CONFIRM) {
              data.orderTimeline.confirmed = {
                success: true,
                date: new Date(),
                expectedDate: null,
              };
            } else if (
              this.dataForm.value.orderStatus === OrderStatus.PROCESSING
            ) {
              data.orderTimeline.processed = {
                success: true,
                date: new Date(),
                expectedDate: this.dataForm.value.processingDate,
              };
            } else if (
              this.dataForm.value.orderStatus === OrderStatus.SHIPPING
            ) {
              data.orderTimeline.shipped = {
                success: true,
                date: new Date(),
                expectedDate: this.dataForm.value.shippingDate,
              };
            } else if (
              this.dataForm.value.orderStatus === OrderStatus.DELIVERED
            ) {
              data.orderTimeline.delivered = {
                success: true,
                date: new Date(),
                expectedDate: this.dataForm.value.deliveringDate,
              };
              if (!data.orderTimeline.confirmed.success) {
                data.orderTimeline.confirmed = {
                  success: true,
                  date: new Date(),
                  expectedDate: null,
                };
              }
              if (!data.orderTimeline.processed.success) {
                data.orderTimeline.processed = {
                  success: true,
                  date: new Date(),
                  expectedDate: this.dataForm.value.processingDate,
                };
              }
              if (!data.orderTimeline.shipped.success) {
                data.orderTimeline.shipped = {
                  success: true,
                  date: new Date(),
                  expectedDate: this.dataForm.value.shippingDate,
                };
              }
            } else if (this.dataForm.value.orderStatus === OrderStatus.CANCEL) {
              data.orderTimeline.canceled = {
                success: true,
                date: new Date(),
                expectedDate: null,
              };
            } else if (this.dataForm.value.orderStatus === OrderStatus.REFUND) {
              data.orderTimeline.refunded = {
                success: true,
                date: new Date(),
                expectedDate: null,
              };
            } else {
              data.orderTimeline.processed = {
                success: true,
                date: new Date(),
                expectedDate: this.dataForm.value.processingDate,
              };
              data.orderTimeline.shipped = {
                success: true,
                date: new Date(),
                expectedDate: this.dataForm.value.shippingDate,
              };
              data.orderTimeline.delivered = {
                success: true,
                date: new Date(),
                expectedDate: this.dataForm.value.deliveringDate,
              };
            }
          } else {
            data.orderTimeline = null;
          }

          this.updateOrderById(data);
        } else {
          // set Timeline
          if (this.dataForm.value.hasOrderTimeline) {
            data.orderTimeline = {
              confirmed: {
                success:
                  this.dataForm.value.orderStatus === OrderStatus.CONFIRM,
                date:
                  this.dataForm.value.orderStatus === OrderStatus.CONFIRM
                    ? new Date()
                    : null,
                expectedDate: null,
              },
              processed: {
                success:
                  this.dataForm.value.orderStatus === OrderStatus.PROCESSING,
                date:
                  this.dataForm.value.orderStatus === OrderStatus.PROCESSING
                    ? new Date()
                    : null,
                expectedDate: this.dataForm.value.processingDate,
              },
              shipped: {
                success:
                  this.dataForm.value.orderStatus === OrderStatus.SHIPPING,
                date:
                  this.dataForm.value.orderStatus === OrderStatus.SHIPPING
                    ? new Date()
                    : null,
                expectedDate: this.dataForm.value.shippingDate,
              },
              delivered: {
                success:
                  this.dataForm.value.orderStatus === OrderStatus.DELIVERED,
                date:
                  this.dataForm.value.orderStatus === OrderStatus.DELIVERED
                    ? new Date()
                    : null,
                expectedDate: this.dataForm.value.deliveringDate,
              },
              canceled: {
                success: this.dataForm.value.orderStatus === OrderStatus.CANCEL,
                date:
                  this.dataForm.value.orderStatus === OrderStatus.CANCEL
                    ? new Date()
                    : null,
                expectedDate: null,
              },
              refunded: {
                success: this.dataForm.value.orderStatus === OrderStatus.REFUND,
                date:
                  this.dataForm.value.orderStatus === OrderStatus.REFUND
                    ? new Date()
                    : null,
                expectedDate: null,
              },
            };
          }

          this.addOrder(data);
        }
      }
    });
  }

  public openProductListDialog() {
    if (this.subRouteTwo) {
      this.subRouteTwo.unsubscribe();
    }
    const dialogRef = this.dialog.open(ProductListComponent, {
      data: {
        ids:
          this.selectedProducts && this.selectedProducts.length
            ? this.selectedProducts.map((m) => m._id)
            : null,
      },
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        if (dialogResult.data) {
          let selectedProducts: Product[];
          if (this.selectedProducts.length && dialogResult.data.unselectedIds) {
            selectedProducts = this.selectedProducts.filter((item) => {
              return dialogResult.data.unselectedIds.indexOf(item._id) === -1;
            });
          } else {
            selectedProducts = this.selectedProducts;
          }

          if (dialogResult.data.selected) {
            console.log(" dialogResult.data", dialogResult.data)
            const mProducts = dialogResult.data.selected.map((m) => {

              console.log(" m.salePric", m.salePrice)
              return {
                ...m,
                ...{
                  selectedQty: 1,
                  salePrice: m.salePrice,
                  regularPrice: m.salePrice,
                  costPrice: m.costPrice,
                  unitPrice: this.pricePipe.transform(m.product as Product, 'salePrice'),
                },
              };
            });
            this.selectedProducts = this.utilsService.mergeArrayUnique(
              selectedProducts,
              mProducts
            );


          } else {
            this.selectedProducts = this.utilsService.mergeArrayUnique(
              selectedProducts,
              []
            );
          }

          console.log('selectedProducts',this.selectedProducts)
        }
      }
    });
  }
  divisionSelected: any;
  areaSelected: any;
  zoneSelected: any;

  onChangeRegion(event: any) {
    if (event) {
      this.divisionSelected = event;
      this.dataForm.get('division')?.patchValue(this.divisionSelected._id);
      this.dataForm.get('area')?.patchValue(null);
      this.dataForm.get('zone')?.patchValue(null);
      this.areaSelected = null;
      this.zoneSelected = null;
      this.getAreaByDivision();
      this.calculateDynamicDeliveryCharge();
    }
  }

  onChangeArea(event: any) {
    if (event) {
      this.areaSelected = event;
      this.dataForm.get('area')?.patchValue(this.areaSelected._id);
      this.dataForm.get('zone')?.patchValue(null);
      this.zoneSelected = null;
      this.getZoneByArea();
    }
  }

  onChangeZone(event: any) {
    if (event) {
      this.zoneSelected = event;
      this.dataForm.get('zone')?.patchValue(this.zoneSelected._id);
    }
  }

  getAreaByDivision() {
    if (!this.divisionSelected?._id) return;
    this.areaService.getAreaByParentId(this.divisionSelected._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.areas = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getZoneByArea() {
    if (!this.areaSelected?._id) return;
    this.zoneService.getZoneByParentId(this.areaSelected._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.zones = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }

    if (this.subRouteTwo) {
      this.subRouteTwo.unsubscribe();
    }
  }


}
