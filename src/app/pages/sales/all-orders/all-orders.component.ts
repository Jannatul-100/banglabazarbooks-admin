import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { EMPTY, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  pluck,
  switchMap,
} from 'rxjs/operators';
import { UpdateOrderStatusComponent } from '../update-order-status/update-order-status.component';
import { CourierSelectionDialogComponent } from '../../../shared/dialog-view/courier-selection-dialog/courier-selection-dialog.component';
import { SelectedOrdersReportDialogComponent } from '../../../shared/dialog-view/selected-orders-report-dialog/selected-orders-report-dialog.component';
import * as XLSX from 'xlsx';
import { AdminPermissions } from '../../../enum/admin-permission.enum';
import { Order } from '../../../interfaces/common/order.interface';
import { AdminService } from '../../../services/admin/admin.service';
import {
  CITIES, MONTHS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_TYPES, REPORT_FILTER, YEARS,
  TABLE_TAB_ORDER_DATA,
} from '../../../core/utils/app-data';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgClassService } from '../../../services/core/ng-class.service';
import { UiService } from '../../../services/core/ui.service';
import { Pagination } from '../../../interfaces/core/pagination';
import { ConfirmDialogComponent } from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import { Select } from '../../../interfaces/core/select';
import { UtilsService } from '../../../services/core/utils.service';
import { OrderService } from '../../../services/common/order.service';
import { ReloadService } from '../../../services/core/reload.service';
import { FilterData } from '../../../interfaces/core/filter-data';
import {Admin} from "../../../interfaces/admin/admin";
import {Courier} from "../../../interfaces/common/courier.interface";
import {DashboardService} from "../../../services/common/dashboard.service";
import {OrderDashboard} from "../../../interfaces/common/dashboard.interface";
import { OrderStatus } from '../../../enum/order.enum';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss'],
})
export class AllOrdersComponent implements OnInit {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];
  orderDashboard: OrderDashboard = null;
  selectedPagination = 0;
  isDraftPage = false;
  isPreOrderPage = false;
  // Store Data
  admin?: Admin;
  years: Select[] = YEARS;
  months: Select[] = MONTHS;
  calculation: any = null;
  count: any = null;
  showCalculation: boolean = false;
  couriers: Courier[] = [];
  orders: Order[] = [];
  orders1: Order[] = [];
  admins: Admin[] = [];
  holdPrevData: Order[] = [];
  toggleMenu: boolean = false;
  showPerPageList = [
    { num: '25' },
    { num: '50' },
    { num: '100' },
    { num: '500' },
    { num: '1000' },
  ];

  // Pagination
  currentPage = 1;
  totalOrders = 0;
  ordersPerPage = 30;
  totalOrdersStore = 0;

  // SEARCH AREA
  searchOrders: Order[] = [];
  searchQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  // Selected Data
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;

  // FilterData
  cities: string[] = CITIES;
  paymentTypes: Select[] = PAYMENT_TYPES;
  paymentStatus: Select[] = PAYMENT_STATUS;
  orderStatus: Select[] = ORDER_STATUS;
  dateByReport: Select[] = REPORT_FILTER;

  today = new Date();
  dataFormDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  // Tab Data
  tableTabData: Select[] = TABLE_TAB_ORDER_DATA;
  selectedTab: string = 'all';
  tabCounts: any = null;

  dataFormDeliveryRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  // Sort
  sortQuery = { createdAt: -1 };
  activeSort: number = null;
  activeFilter1: number = null;
  activeFilter2: number = null;
  activeFilter3: number = null;
  activeFilter4: number = null;
  activeFilter5: number = null;
  activeFilter6: number = null;
  activeFilter7: number = null;
  activeFilter8: number = null;
  activeFilterAdmin: number = null;

  // FilterData
  filter: any = null;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  private subDataSix: Subscription;
  private subDataSeven: Subscription;
  private subDataEight: Subscription;
  private subRouteOne: Subscription;
  private subReload: Subscription;
  private subForm: Subscription;

  constructor(
    private dialog: MatDialog,
    private orderService: OrderService,
    private adminService: AdminService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dashboardService: DashboardService,
    public ngClassService: NgClassService
  ) {}

  ngOnInit(): void {
    this.isDraftPage = this.router.url.includes('draft-orders');
    this.isPreOrderPage = this.router.url.includes('pre-orders');
    if (this.isDraftPage) {
      this.tableTabData = [{ value: OrderStatus.DRAFT, viewValue: 'Draft' }];
      this.selectedTab = String(OrderStatus.DRAFT);
      this.filter = { orderStatus: OrderStatus.DRAFT };
    } else if (this.isPreOrderPage) {
      this.tableTabData = TABLE_TAB_ORDER_DATA.filter(t => t.value !== OrderStatus.DRAFT);
      this.filter = { hasPreOrder: true, orderStatus: { $ne: OrderStatus.DRAFT } };
    } else {
      this.tableTabData = TABLE_TAB_ORDER_DATA.filter(t => t.value !== OrderStatus.DRAFT);
      this.filter = { hasPreOrder: { $ne: true }, orderStatus: { $ne: OrderStatus.DRAFT } };
    }

    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllOrders();
      this.getAllOrders1();
    });

    // Base Admin Data
    this.getAdminBaseData();

    this.adminService.getAllAdmins({ pagination: { currentPage: 1, pageSize: 100 }, filter: { role: { $in: ['admin', 'editor', 'salesman'] } } }).subscribe(res => {
      if (res.success) {
        this.admins = res.data;
      }
    });

    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParams.subscribe((qParam) => {
      if (qParam && qParam['page']) {
        this.currentPage = qParam['page'];
      } else {
        this.currentPage = 1;
      }
      this.getAllOrders();
      this.getAllOrders1();
    });
    this.getOrderDashboard();
  }

  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    this.subForm = formValue
      .pipe(
        // map(t => t.searchTerm)
        // filter(() => this.searchForm.valid),
        pluck('searchTerm'),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((data) => {
          this.searchQuery = data;
          if (this.searchQuery === '' || this.searchQuery === null) {
            this.searchOrders = [];
            this.orders = this.holdPrevData;
            this.totalOrders = this.totalOrdersStore;
            this.searchQuery = null;
            return EMPTY;
          }
          const pagination: Pagination = {
            pageSize: Number(this.ordersPerPage),
            currentPage: Number(this.currentPage) - 1,
          };
          // Select
          const mSelect = {
            name: 1,
            orderId: 1,
            phoneNo: 1,
            city: 1,
            paymentType: 1,
            grandTotal: 1,
            checkoutDate: 1,
            orderStatus: 1,
            paymentStatus: 1,
            createdAt: 1,
            deliveryDate: 1,
            preferredDate: 1,
            preferredTime: 1,
            preferredDateString: 1,
            orderFrom: 1,
            createdByAdmin: 1,
            courierData: 1,
            processedBy: 1,
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: this.filter,
            select: mSelect,
            sort: this.sortQuery,
          };
          return this.orderService.getAllOrders(filterData, this.searchQuery);
        })
      )
      .subscribe(
        (res) => {
          this.searchOrders = res.data;
          this.orders = this.searchOrders;
          this.totalOrders = res.count;
          this.currentPage = 1;
          this.router.navigate([], { queryParams: { page: this.currentPage } });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /**
   * CHECK ADMIN PERMISSION
   * checkAddPermission()
   * checkDeletePermission()
   * checkEditPermission()
   * getAdminBaseData()
   */
  get checkAddPermission(): boolean {
    return this.permissions.includes(AdminPermissions.CREATE);
  }

  get checkDeletePermission(): boolean {
    return this.permissions.includes(AdminPermissions.DELETE);
  }

  get checkEditPermission(): boolean {
    return this.permissions.includes(AdminPermissions.EDIT);
  }

  get hasFilter(): boolean {
    const currentFilter = JSON.stringify(this.filter);
    const defaultFilter = this.isDraftPage 
      ? JSON.stringify({ orderStatus: OrderStatus.DRAFT })
      : JSON.stringify({ orderStatus: { $ne: OrderStatus.DRAFT } });
      
    if (currentFilter && currentFilter !== '{}' && currentFilter !== defaultFilter) {
      return true;
    }
    return false;
  }

  private getAdminBaseData() {
    this.adminId = this.adminService.getAdminId();
    this.role = this.adminService.getAdminRole();
    this.permissions = this.adminService.getAdminPermissions();
  }

  /**
   * ON Select Check
   * onCheckChange()
   * onAllSelectChange()
   * checkSelectionData()
   */

  onCheckChange(event: any, index: number, id: string) {
    if (event) {
      if (!this.selectedIds.includes(id)) {
        this.selectedIds.push(id);
      }
    } else {
      const i = this.selectedIds.findIndex((f) => f === id);
      if (i !== -1) {
        this.selectedIds.splice(i, 1);
      }
    }
  }

  toggleRowSelection(event: MouseEvent, i: number, data: any) {
    // Prevent double triggering if they click elements that handle their own clicks
    const target = event.target as HTMLElement;
    if (target.closest('mat-checkbox') || target.closest('button') || target.closest('a') || target.closest('.mat-checkbox-layout')) {
      return;
    }
    
    // Check if some text is selected; if so, don't toggle the row selection
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      return;
    }

    data.select = !data.select;
    this.onCheckChange(data.select, i, data._id);
  }

  onAllSelectChange(event: MatCheckboxChange) {
    const currentPageIds = this.orders.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.orders.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.orders.find((f) => f._id === m).select = false;
        const i = this.selectedIds.findIndex((f) => f === m);
        this.selectedIds.splice(i, 1);
      });
    }
  }
  private checkSelectionData() {
    let isAllSelect = true;
    this.orders.forEach((m) => {
      if (!m.select) {
        isAllSelect = false;
      }
    });

    this.matCheckbox.checked = isAllSelect;
  }

  clearSelection() {
    this.selectedIds = [];
    this.orders.forEach((order) => {
      order.select = false;
    });
    if (this.matCheckbox) {
      this.matCheckbox.checked = false;
    }
  }

  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], { queryParams: { page: event } });
  }

  public SelectChange(data: any) {
    this.ordersPerPage = data;
    this.selectedPagination = data;
    this.getAllOrders();
    this.getAllOrders1();
  }




  getOrderDashboard() {
    this.subDataOne = this.dashboardService.getOrderDashboard()
      .subscribe({
        next: (res) => {
          this.orderDashboard = res.data;

        },
        error: (err) => {
          console.log(err)
        }
      })
  }

  /**
   * FILTER DATA With Date Range
   * endChangeRegDateRange()
   * endChangeDeliveryDateRange()
   */

  endChangeRegDateRange(event: MatDatepickerInputEvent<any>) {
    if (event.value) {
      const startDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.start
      );
      const endDate = this.utilsService.getNextDateString(
        this.dataFormDateRange.value.end,
        1
      );

      const qData = { checkoutDate: { $gte: startDate, $lte: endDate } };
      this.filter = { ...this.filter, ...qData };


      if (this.currentPage > 1) {
        this.router.navigate([], { queryParams: { page: 1 } });
      } else {
        this.getAllOrders();
        this.getAllOrders1();
      }
    }
  }

  endChangeDeliveryDateRange(event: MatDatepickerInputEvent<any>) {

    if (event.value) {
      const startDate = this.utilsService.getDateString(
        this.dataFormDeliveryRange.value.start
      );
      const endDate = this.utilsService.getDateString(
        this.dataFormDeliveryRange.value.end
      );

      const qData = { preferredDateString: { $gte: startDate, $lte: endDate } };

      this.filter = { ...this.filter, ...qData };


      if (this.currentPage > 1) {
        this.router.navigate([], { queryParams: { page: 1 } });
      } else {
        this.getAllOrders();
        this.getAllOrders1();
      }
    }
  }

  onChangeShowCalculation(event: any) {
    this.showCalculation = event;
    localStorage.setItem('showCalculation', String(this.showCalculation));
  }
  /**
   * SORTING
   */
  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllOrders();
    this.getAllOrders1();
  }

  /**
   * FILTERING
   */
  filterData(value: any, index: number, type: string) {
    switch (type) {
      case 'paymentStatus': {
        this.filter = { ...this.filter, ...{ paymentStatus: value } };
        this.activeFilter1 = index;
        break;
      }
      case 'paymentType': {
        this.filter = { ...this.filter, ...{ paymentType: value } };
        this.activeFilter2 = index;
        break;
      }
      case 'orderStatus': {
        this.filter = { ...this.filter, ...{ orderStatus: value } };
        this.activeFilter3 = index;
        break;
      }
      case 'city': {
        this.filter = { ...this.filter, ...{ city: value } };
        this.activeFilter4 = index;
        break;
      }
      case 'processedBy': {
        this.filter = { ...this.filter, ...{ processedBy: value } };
        this.activeFilterAdmin = index;
        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data

    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } });
    } else {
      this.getAllOrders();
      this.getAllOrders1();
    }
  }

  /**
   * ON REMOVE ALL QUERY
   */

  onRemoveAllQuery() {
    this.activeSort = null;
    this.activeFilter1 = null;
    this.activeFilter2 = null;
    this.activeFilter3 = null;
    this.activeFilter4 = null;
    this.activeFilterAdmin = null;
    this.sortQuery = { createdAt: -1 };
    if (this.isDraftPage) {
      this.filter = { orderStatus: OrderStatus.DRAFT };
      this.selectedTab = String(OrderStatus.DRAFT);
    } else if (this.isPreOrderPage) {
      this.filter = { hasPreOrder: true, orderStatus: { $ne: OrderStatus.DRAFT } };
      this.selectedTab = 'all';
    } else {
      this.filter = { hasPreOrder: { $ne: true }, orderStatus: { $ne: OrderStatus.DRAFT } };
      this.selectedTab = 'all';
    }
    this.searchQuery = null;
    if (this.searchForm) {
      this.searchForm.resetForm();
    }
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
    this.dataFormDateRange.reset();
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } });
    } else {
      this.getAllOrders();
      this.getAllOrders1();
    }
  }

  /**
   * HTTP REQ HANDLE
   * getAllOrders()
   * deleteMultipleOrderById()
   * changeOrderStatus()
   */

  private getAllOrders1() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: Number(this.ordersPerPage),
      currentPage: Number(this.currentPage) - 1,
    };

    // FilterData
    // const mQuery = this.filter.length > 0 ? {$and: this.filter} : null;

    // Select
    const mSelect = {
      name: 1,
      orderId: 1,
      phoneNo: 1,
      city: 1,
      paymentType: 1,
      grandTotal: 1,
      courierLink: 1,
      orderedItems: 1,
      checkoutDate: 1,
      orderStatus: 1,
      paymentStatus: 1,
      createdAt: 1,
      deliveryDate: 1,
      preferredDate: 1,
      preferredTime: 1,
      orderDiscountFromApps: 1,
      orderFrom: 1,
      createdByAdmin: 1,
      courierData: 1,
      processedBy: 1,
      hasPreOrder: 1,
    };

    const filterData: FilterData = {
      pagination: {
        pageSize: Number(this.ordersPerPage),
        currentPage: Number(this.currentPage) - 1,
      },
      // filter: {...this.filter, orderStatus: { $ne: 6 }},
      filter: this.filter,
      select: mSelect,
      sort: this.sortQuery,
    };

    this.subDataOne = this.orderService
      .getAllOrders(filterData, this.searchQuery)
      .subscribe(
        (res) => {
          this.spinner.hide();
          this.orders1 = res.data;
          // console.log('orders1',this.orders1)
          this.getAllRepairAmount();
          this.count = res.count;
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
  }

  private getAllOrders() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: Number(this.ordersPerPage),
      currentPage: Number(this.currentPage) - 1,
    };

    // FilterData
    // const mQuery = this.filter.length > 0 ? {$and: this.filter} : null;

    // Select
    const mSelect = {
      name: 1,
      orderId: 1,
      phoneNo: 1,
      city: 1,
      paymentType: 1,
      grandTotal: 1,
      courierLink: 1,
      orderedItems: 1,
      checkoutDate: 1,
      orderStatus: 1,
      paymentStatus: 1,
      createdAt: 1,
      deliveryDate: 1,
      preferredDate: 1,
      preferredTime: 1,
      orderDiscountFromApps: 1,
      courierData: 1,
      fraudChecker: 1,
      shippingAddress: 1,
      orderFrom: 1,
      createdByAdmin: 1,
      processedBy: 1,
      hasPreOrder: 1,
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: this.filter,
      select: mSelect,
      sort: this.sortQuery,
    };

    this.getTabCounts();

    this.subDataOne = this.orderService
      .getAllOrders(filterData, this.searchQuery)
      .subscribe(
        (res) => {
          this.spinner.hide();
          this.orders = res.data;
          this.count = res.count;

          if (this.orders && this.orders.length) {
            this.orders.forEach((m, i) => {
              const index = this.selectedIds.findIndex((f) => f === m._id);
              this.orders[i].select = index !== -1;
            });

            this.totalOrders = res.count;
            if (!this.searchQuery) {
              this.holdPrevData = res.data;
              this.totalOrdersStore = res.count;
            }

            this.checkSelectionData();
          }
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
  }

  getAllRepairAmount() {
    return this.orders1.map(t => (t?.grandTotal ?? 0)).reduce((acc, value) => acc + value, 0)
  }


  private deleteMultipleOrderById() {
    this.spinner.show();
    this.subDataFour = this.orderService
      .deleteMultipleOrderById(this.selectedIds)
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.success) {
            this.selectedIds = [];
            this.uiService.success(res.message);
            // fetch Data
            if (this.currentPage > 1) {
              this.router.navigate([], { queryParams: { page: 1 } });
            } else {
              this.getAllOrders();
            }
          } else {
            this.uiService.warn(res.message);
          }
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
  }

  private changeOrderStatus(id: string, data: any) {
    this.spinner.show();
    this.subDataThree = this.orderService.changeOrderStatus(id, data).subscribe(
      (res) => {
        this.spinner.hide();
        if (res.success) {
          this.selectedIds = [];
          this.uiService.success(res.message);
          this.reloadService.needRefreshData$();
        } else {
          this.uiService.warn(res.message);
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  sendToCourier(id: string) {
    const dialogRef = this.dialog.open(CourierSelectionDialogComponent, {
      width: '400px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.spinner.show();
        this.orderService.sendToCourier(id, dialogResult).subscribe({
          next: (res) => {
            this.spinner.hide();
            if (res.success) {
              this.uiService.success(res.message || 'Order sent to courier successfully');
              this.reloadService.needRefreshData$();
            } else {
              this.uiService.warn(res.message || 'Failed to send to courier');
            }
          },
          error: (err) => {
            this.spinner.hide();
            const msg = err.error?.message || 'Error communicating with Courier API';
            this.uiService.warn(msg);
            console.log(err);
          }
        });
      }
    });
  }

  openCourierSelectionDialog() {
    const dialogRef = this.dialog.open(CourierSelectionDialogComponent, {
      width: '400px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.bulkSendToCourier(dialogResult);
      }
    });
  }

  private bulkSendToCourier(courierData: any) {
    this.spinner.show();
    const data = {
      ids: this.selectedIds,
      courierData: courierData
    };
    this.orderService.bulkSendToCourier(data).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res.success) {
          this.uiService.success(res.message);
          this.selectedIds = [];
          this.reloadService.needRefreshData$();
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.uiService.warn(err.error?.message || 'Bulk process failed');
        console.log(err);
      }
    });
  }

  onMultiplePrint() {
    if (this.selectedIds.length > 0) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/sales/order-print'], { queryParams: { ids: this.selectedIds.join(',') } })
      );
      window.open(url, '_blank');
    } else {
      this.uiService.warn('Please select at least one order to print');
    }
  }

  onMultipleStickerPrint() {
    if (this.selectedIds.length > 0) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/sales/multiple-sticker'], { queryParams: { ids: this.selectedIds.join(',') } })
      );
      window.open(url, '_blank');
    } else {
      this.uiService.warn('Please select at least one order to print sticker');
    }
  }

  onCheckBulkFraud() {
    if (this.selectedIds.length === 0) {
      this.uiService.warn('Please select at least one order');
      return;
    }

    const selectedOrders = this.orders.filter(o => this.selectedIds.includes(o._id));
    const phoneNumbers = [...new Set(selectedOrders.map(o => o.phoneNo))];

    this.spinner.show();
    let completed = 0;
    
    phoneNumbers.forEach(phone => {
      this.orderService.checkFraudOrder(phone).subscribe({
        next: () => {
          completed++;
          if (completed === phoneNumbers.length) {
            this.spinner.hide();
            this.uiService.success('Fraud check completed for ' + phoneNumbers.length + ' customers');
            this.reloadService.needRefreshData$();
          }
        },
        error: () => {
          completed++;
          if (completed === phoneNumbers.length) {
            this.spinner.hide();
            this.reloadService.needRefreshData$();
          }
        }
      });
    });
  }

  openSelectedOrdersReport() {
    if (this.selectedIds.length === 0) {
      this.uiService.warn('Please select at least one order');
      return;
    }

    const selectedOrders = this.orders.filter(o => this.selectedIds.includes(o._id));
    
    const productMap = new Map<string, any>();
    
    selectedOrders.forEach(order => {
      if (order.orderedItems && order.orderedItems.length > 0) {
        order.orderedItems.forEach((item: any) => {
          const productId = item._id;
          const qty = item.quantity || 1;
          
          let writerName = 'N/A';
          if (Array.isArray(item.author) && item.author.length > 0) {
            writerName = item.author.map((a: any) => typeof a === 'string' ? a : (a?.name || '')).filter(Boolean).join(', ');
          } else if (item.author && typeof item.author === 'object' && item.author.name) {
            writerName = item.author.name;
          } else if (typeof item.author === 'string' && item.author.trim()) {
            writerName = item.author;
          } else if (Array.isArray(item.authors) && item.authors.length > 0) {
            writerName = item.authors.map((a: any) => typeof a === 'string' ? a : (a?.name || '')).filter(Boolean).join(', ');
          } else if (item.writer && typeof item.writer === 'object' && item.writer.name) {
            writerName = item.writer.name;
          } else if (typeof item.writer === 'string' && item.writer.trim()) {
            writerName = item.writer;
          } else if (item.brand && typeof item.brand === 'object' && item.brand.name) {
            writerName = item.brand.name;
          } else if (typeof item.brand === 'string' && item.brand.trim()) {
            writerName = item.brand;
          } else if (item.authorName) {
            writerName = item.authorName;
          } else if (item.writerName) {
            writerName = item.writerName;
          } else if (Array.isArray(item.editor) && item.editor.length > 0) {
            writerName = item.editor.map((a: any) => typeof a === 'string' ? a : (a?.name || '')).filter(Boolean).join(', ');
          } else if (item.editor && typeof item.editor === 'object' && item.editor.name) {
            writerName = item.editor.name;
          } else if (typeof item.editor === 'string' && item.editor.trim()) {
            writerName = item.editor;
          }

          if (productMap.has(productId)) {
            const existing = productMap.get(productId);
            existing.totalQuantity += qty;
          } else {
            productMap.set(productId, {
              productName: item.name,
              writerName: writerName || 'N/A',
              publisherName: item.publisher?.name || 'N/A',
              totalQuantity: qty
            });
          }
        });
      }
    });

    const reportData = Array.from(productMap.values());
    reportData.sort((a, b) => {
      const pubA = a.publisherName || '';
      const pubB = b.publisherName || '';
      const pubCompare = pubA.localeCompare(pubB);
      if (pubCompare !== 0) {
        return pubCompare;
      }
      return b.totalQuantity - a.totalQuantity;
    });

    this.dialog.open(SelectedOrdersReportDialogComponent, {
      width: '800px',
      data: { reportData }
    });
  }

  onChangeBulkStatus(status: string) {
    if (this.selectedIds.length > 0) {
      let statusNumber: number;
      switch (status) {
        case 'pending': statusNumber = 1; break;
        case 'confirm': statusNumber = 2; break;
        case 'processing': statusNumber = 3; break;
        case 'shipping': statusNumber = 4; break;
        case 'sent_to_courier': statusNumber = 8; break;
        case 'delivered': statusNumber = 5; break;
        case 'cancel': statusNumber = 6; break;
        case 'refund':
        case 'return': statusNumber = 7; break;
        default: statusNumber = 1;
      }
      const data = { orderStatus: statusNumber };
      this.changeOrderMultiStatus(null, data);
    } else {
      this.uiService.warn('Please select at least one order');
    }
  }

  private changeOrderMultiStatus(id: string, data: any) {
    if (!this.selectedIds || this.selectedIds.length === 0) {
      this.uiService.warn('Please select at least one order');
      return;
    }
    this.spinner.show();
    this.subDataThree = this.orderService.updateMultipleOrderById(this.selectedIds, data)
      .subscribe(res => {
        this.spinner.hide();
        if (res.success) {
          this.selectedIds = [];
          this.orders.forEach((m) => (m.select = false));
          if (this.matCheckbox) {
            this.matCheckbox.checked = false;
          }
          this.uiService.success(res.message);
          this.reloadService.needRefreshData$();
        } else {
          this.uiService.warn(res.message);
        }
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
   * openUpdateOrderStatusDialog()
   */
  public openConfirmDialog(type: string) {
    switch (type) {
      case 'delete': {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: '400px',
          data: {
            title: 'Confirm Delete',
            message: 'Are you sure you want delete this data?',
          },
        });
        dialogRef.afterClosed().subscribe((dialogResult) => {
          if (dialogResult) {
            this.deleteMultipleOrderById();
          }
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  public openUpdateOrderStatusDialog(order: Order) {
    const dialogRef = this.dialog.open(UpdateOrderStatusComponent, {
      width: '95%',
      maxWidth: '480px',
      data: order,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        if (dialogResult.data) {
          console.log('dialogResult.data',dialogResult.data);
          this.changeOrderStatus(order._id, dialogResult.data);
        }
      }
    });
  }


  // open  Update Multi Order Status Dialogs

  public openUpdateOrderStatusDialogs() {
    if (!this.selectedIds || this.selectedIds.length === 0) {
      this.uiService.warn('Please select at least one order');
      return;
    }
    const dialogRef = this.dialog.open(UpdateOrderStatusComponent, {
      width: '95%',
      maxWidth: '480px',
      data: { orderStatusList: this.orderStatus }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult && dialogResult.data) {
        this.changeOrderMultiStatus(null, dialogResult.data);
      }
    });
  }

  /**
   * EXPORTS TO EXCEL
   * exportToExcel()
   */
  exportToExcel() {
    this.spinner.show();
    // Select
    const mSelect = {
      name: 1,
      email: 1,
      orderId: 1,
      phoneNo: 1,
      city: 1,
      grandTotal: 1,
      checkoutDate: 1,
      orderStatus: 1,
      paymentStatus: 1,
      paymentType: 1,
      createdAt: 1,
      shippingAddress: 1,
      deliveryDate: 1,
      processedBy: 1,
    };

    const filterData: FilterData = {
      pagination: {
        pageSize: Number(this.ordersPerPage),
        currentPage: Number(this.currentPage) - 1,
      },
      filter: this.filter,
      select: mSelect,
      sort: this.sortQuery,
    };

    this.subDataOne = this.orderService
      .getAllOrders(filterData, this.searchQuery)
      .subscribe(
        (res) => {

          this.spinner.hide();
          const subscriptionReports = res.data;
          const date = this.utilsService.getDateString(new Date());
          const mData = subscriptionReports.map((m) => {
            return {
              orderId: m.orderId,
              phoneNo: m.phoneNo,
              name: m.name,
              email: m.email ? m.email : 'n/a',
              orderAt: m.checkoutDate,
              deliveryAt: m.deliveryDate ? m.deliveryDate : 'n/a',
              city: m.city,
              shippingAddress: m.shippingAddress,
              paymentType: m.paymentType,
              paymentStatus: m.paymentStatus,
              orderStatus: m.orderStatus,
              grandTotal: m.grandTotal,
              createdAt: this.utilsService.getDateString(m.createdAt),
            };
          });


          // EXPORT XLSX
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Data');
          XLSX.writeFile(wb, `Products_Reports_${date}.xlsx`);
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
  }



  /**
   * EXPORTS TO EXCEL
   * exportToExcel()
   */


  exportToAllExcel() {
    // let dataArray:any[] = [];
    const date = this.utilsService.getDateString(new Date());
    if (this.selectedIds.length) {
      const dataArray = [];
      this.selectedIds.forEach(id => {
        const data = this.orders.find(f => f._id === id);
        dataArray.push(data);
      })
      console.log('dataArray',dataArray)
      const mData = dataArray.map((m) => {
        return {
          'Order Id': m?.orderId ?? '-',
          'Customer': m?.name ?? '-',
          'Phone No': m?.phoneNo ?? '-',
          'Address': m?.shippingAddress ?? '-',
          'Medicine': m?.orderedItems.map(p => p.name).join() ?? '-',
          // 'Quantity': m?.orderedItems.map(p => p.quantity).join() ?? '-',
          // 'MRP': m?.orderedItems.map(p => p.regularPrice).join() ?? '-',
          // 'Discount Type': m?.orderedItems.map(p => p.discountType).join() ?? '-',
          // 'Discount Amount': m?.orderedItems.map(p => p.discountAmount).join() ?? '-',
          // 'Sub Total': m?.subTotal ?? '-',
          // 'Products Discount': m?.productDiscount ?? '-',
          // 'Products Price': (m.subTotal - m.productDiscount - m.discount) ?? '-',
          'Grand Total': m?.grandTotal ?? '-',
          'Payment Type': m?.paymentType ?? '-',
          'Payment Status': m?.paymentStatus ?? '-',
          'Due': m?.paymentStatus === 'paid' ? 0 : (m?.grandTotal ?? 0),
          // 'Delivery Charge': m?.deliveryCharge ?? '-',
          // 'Delivery Type': m?.orderType ?? '-',
          'Delivery Status': m?.orderStatus ?? '-',
          // 'Admin Profit': m?.adminProfit ?? '-',
          'Created Date': this.utilsService.getDateString(m?.createdAt),
        };
      });

      // EXPORT XLSX
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `Transaction_Orders_${date}.xlsx`);

    } else {
      const mSelect = {
        name: 1,
        orderId: 1,
        phoneNo: 1,
        city: 1,
        shippingAddress: 1,
        paymentType: 1,
        grandTotal: 1,
        checkoutDate: 1,
        orderStatus: 1,
        paymentStatus: 1,
        createdAt: 1,
        deliveryDate: 1,
        preferredDate: 1,
        preferredTime: 1,
        orderType: 1,
        orderedItems: 1,
        adminProfit: 1,
        pharmacyPayable: 1,
        discount: 1,
        deliveryCharge: 1,
        subTotal: 1,
        productDiscount: 1,
        processedBy: 1,
      };

      const filter: FilterData = {
        filter: this.filter,
        pagination: null,
        select: mSelect,
        sort: this.sortQuery,
      };

      this.orderService.getAllOrders(filter, null).subscribe({
        next: (res) => {
          if (res.success) {
            console.log('res',res.data);
            const mData = res.data.map((m) => {
              return {
                'Order Id': m?.orderId ?? '-',
                'Customer': m?.name ?? '-',
                'Phone No': m?.phoneNo ?? '-',
                'Address': m?.shippingAddress ?? '-',
                'Medicine': m?.orderedItems.map(p => p.name).join() ?? '-',
                'Quantity': m?.orderedItems.map(p => p.quantity).join() ?? '-',
                // 'MRP': m?.orderedItems.map(p => p.regularPrice).join() ?? '-',
                // 'Discount Type': m?.orderedItems.map(p => p.discountType).join() ?? '-',
                // 'Discount Amount': m?.orderedItems.map(p => p.discountAmount).join() ?? '-',
                // 'Sub Total': m?.subTotal ?? '-',
                // 'Products Discount': m?.productDiscount ?? '-',
                // 'Products Price': (m.subTotal - m.productDiscount - m.discount) ?? '-',
                'Grand Total': m?.grandTotal ?? '-',
                'Payment Type': m?.paymentType ?? '-',
                'Payment Status': m?.paymentStatus ?? '-',
                'Due': m?.paymentStatus === 'paid' ? 0 : (m?.grandTotal ?? 0),
                'Delivery Charge': m?.deliveryCharge ?? '-',
                // 'Delivery Type': m?.orderType ?? '-',
                'Delivery Status': m?.orderStatus ?? '-',
                'Created Date': this.utilsService.getDateString(m?.createdAt),
              };
            });

            // EXPORT XLSX
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Data');
            XLSX.writeFile(wb, `Transaction_Orders_${date}.xlsx`);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }

  }

  /**
   *onSelectShowPerPage()
   */

  onSelectShowPerPage(val) {
    this.ordersPerPage = val;
    this.getAllOrders();
    this.getAllOrders1();
  }

  /**
   * UI Essentials
   * onToggle()
   */
  onToggle() {
    console.log('Click');
    this.toggleMenu = !this.toggleMenu;
  }

  /**
   * ON DESTROY
   */

  getTabCounts() {
    const filterData: FilterData = {
      filter: this.filter,
    };
    this.orderService.getTabCounts(filterData, this.searchQuery).subscribe({
      next: (res) => {
        if (res.success) {
          this.tabCounts = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onTabChange(tab: string) {
    this.selectedTab = tab;
    if (!this.filter) {
      this.filter = {};
    }
    if (tab === 'all') {
      delete this.filter['orderStatus'];
      if (!this.isDraftPage) {
        this.filter['orderStatus'] = { $ne: OrderStatus.DRAFT };
      }
    } else {
      this.filter['orderStatus'] = Number(tab);
    }
    this.currentPage = 1;
    this.getAllOrders();
  }

  getTabCount(val: string) {
    if (!this.tabCounts) return 0;
    return this.tabCounts[val] || 0;
  }

  copyToClipboard(event: MouseEvent, text: string) {
    event.stopPropagation();
    this.utilsService.copyToClipboard(text);
    this.uiService.success('Tracking code copied to clipboard');
  }

  getAdminName(adminId: any): string {
    if (!adminId) return '';
    const id = typeof adminId === 'string' ? adminId : (adminId._id || adminId);
    const admin = this.admins.find(a => a._id === id);
    if (admin) {
      return admin.name;
    }
    return 'Unknown';
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
    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
    if (this.subDataFive) {
      this.subDataFive.unsubscribe();
    }
    if (this.subDataSix) {
      this.subDataSix.unsubscribe();
    }
    if (this.subDataSeven) {
      this.subDataSeven.unsubscribe();
    }
    if (this.subDataEight) {
      this.subDataEight.unsubscribe();
    }
    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
    if (this.subReload) {
      this.subReload.unsubscribe();
    }
    if (this.subForm) {
      this.subForm.unsubscribe();
    }
  }
}
