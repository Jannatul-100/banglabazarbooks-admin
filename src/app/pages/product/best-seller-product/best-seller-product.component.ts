import {Component, OnInit, ViewChild} from '@angular/core';
import {AdminPermissions} from "../../../enum/admin-permission.enum";
import {Product} from "../../../interfaces/common/product.interface";
import {Category} from "../../../interfaces/common/category.interface";
import {Brand} from "../../../interfaces/common/brand.interface";
import {Publisher} from "../../../interfaces/common/publisher.interface";
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {EMPTY, Subscription} from "rxjs";
import {ProductService} from "../../../services/common/product.service";
import {UiService} from "../../../services/core/ui.service";
import {UtilsService} from "../../../services/core/utils.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {ReloadService} from "../../../services/core/reload.service";
import {CategoryService} from "../../../services/common/category.service";
import {PublisherService} from "../../../services/common/publisher.service";
import {debounceTime, distinctUntilChanged, pluck, switchMap} from "rxjs/operators";
import {Pagination} from "../../../interfaces/core/pagination";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as XLSX from "xlsx";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-best-seller-product',
  templateUrl: './best-seller-product.component.html',
  styleUrls: ['./best-seller-product.component.scss']
})
export class BestSellerProductComponent implements OnInit {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];
  selectedPagination = 0;

  // Store Data
  toggleMenu: boolean = false;
  products: Product[] = [];
  holdPrevData: Product[] = [];
  categories: Category[]=[];
  brands:Brand[]=[];
  publishers: Publisher[]=[];
  productCount = 0;
  id?: string;

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  ProductsPerPage = 10;
  totalProductsStore = 0;

  // FilterData
  filter: any = null;
  sortQuery: any = {createdAt: -1};
  activeFilter1: number = null;
  activeFilter2: number = null;
  activeFilter3: number = null;
  activeFilter6: number = null;
  activeSort: number;
  number = [{num: '10'}, {num: '25'}, {num: '50'}, {num: '100'}];

  // Selected Data
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;

  // Date
  today = new Date();
  dataFormDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  // Search Area
  @ViewChild('searchForm') searchForm: NgForm;
  searchQuery = null;
  searchProduct: Product[] = [];

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subRouteTwo: Subscription;
  private subForm: Subscription;
  private subRouteOne: Subscription;
  private subReload: Subscription;

  constructor(
    private productService: ProductService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private publisherService: PublisherService,
  ) {
  }

  ngOnInit(): void {
    // Reload
    this.subReload = this.reloadService.refreshBrand$.subscribe(() => {
      this.getAllProduct();
    });

    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
      } else {
        this.currentPage = 1;
      }
      this.getAllProduct();
    });

    this.getAllCategory();
    this.getAllPublisher();
  }

  // ngAfterViewInit(): void {
  //   const formValue = this.searchForm.valueChanges;
  //
  //   this.subForm = formValue
  //     .pipe(
  //       // map(t => t.searchTerm)
  //       // filter(() => this.searchForm.valid),
  //       pluck('searchTerm'),
  //       debounceTime(200),
  //       distinctUntilChanged(),
  //       switchMap((data) => {
  //         this.searchQuery = data;
  //         if (this.searchQuery === '' || this.searchQuery === null) {
  //           this.searchProduct = [];
  //           this.products = this.holdPrevData;
  //           this.totalProducts = this.totalProductsStore;
  //           this.searchQuery = null;
  //           return EMPTY;
  //         }
  //         const pagination: Pagination = {
  //           pageSize: Number(this.ProductsPerPage),
  //           currentPage: Number(this.currentPage) - 1,
  //         };
  //
  //         // Select
  //         const mSelect = {
  //           image: 1,
  //           name: 1,
  //           images: 1,
  //           createdAt: 1,
  //           publisher: 1,
  //           brand: 1,
  //           costPrice: 1,
  //           salePrice: 1,
  //           discountType: 1,
  //           discountAmount: 1,
  //           quantity: 1,
  //           category: 1,
  //           subCategory: 1,
  //           unit: 1,
  //           status: 1,
  //           threeMonth: 1,
  //           sixMonth: 1,
  //           twelveMonth: 1,
  //         };
  //
  //         const filterData: FilterData = {
  //           pagination: pagination,
  //           // filter: this.filter,
  //           // this.filter = { ...this.filter, quantity: { $lte: Number(value) } };
  //           filter: { ...this.filter, quantity: { $lte: Number(10) } },
  //           select: mSelect,
  //           sort: {createdAt: -1},
  //         };
  //
  //         return this.productService.getAllProducts(
  //           filterData,
  //           this.searchQuery
  //         );
  //       })
  //     )
  //     .subscribe({
  //       next: (res) => {
  //         this.searchProduct = res.data;
  //         this.products = this.searchProduct;
  //         this.totalProducts = res.count;
  //         this.currentPage = 1;
  //         this.router.navigate([], {queryParams: {page: this.currentPage}});
  //       },
  //       error: (error) => {
  //         console.log(error);
  //       },
  //     });
  // }

  /**
   * CHECK ADMIN PERMISSION
   * onSelectShowPerPage()
   * checkAddPermission()
   * checkEditPermission()
   * checkDeletePermission()
   */
  onSelectShowPerPage(val) {
    this.ProductsPerPage = val;
    this.getAllProduct();
  }

  checkAddPermission(): boolean {
    return this.permissions.includes(AdminPermissions.CREATE);
  }

  checkEditPermission(): boolean {
    return this.permissions.includes(AdminPermissions.EDIT);
  }

  checkDeletePermission(): boolean {
    return this.permissions.includes(AdminPermissions.DELETE);
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
   * HTTP REQ HANDLE
   * getAllProduct()
   * deleteMultipleProductById()
   * deleteMultipleFile()
   */

  private getAllProduct() {
    // Select
    const mSelect = {
      image: 1,
      name: 1,
      images: 1,
      createdAt: 1,
      publisher: 1,
      author: 1,
      brand: 1,
      costPrice: 1,
      salePrice: 1,
      discountType: 1,
      discountAmount: 1,
      quantity: 1,
      category: 1,
      subCategory: 1,
      unit: 1,
      totalSold: 1,
      status: 1,
      threeMonth: 1,
      sixMonth: 1,
      twelveMonth: 1,
    };

    const filter: FilterData = {
      // filter: this.filter,
      filter: { ...this.filter ,status: 'publish'},
      pagination: {
        pageSize: Number(this.ProductsPerPage),
        currentPage: Number(this.currentPage) - 1,
      },
      select: mSelect,
      sort: {totalSold: -1},
    };

    this.subDataOne = this.productService
      .getAllProducts(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.products = res.data;
            this.productCount = res.count;
            this.holdPrevData = this.products;
            this.totalProductsStore = this.productCount;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private getAllPublisher() {
    // Select
    const mSelect = {
      image: 1,
      name: 1,
      createdAt: 1,
    };

    const filter: FilterData = {
      filter: this.filter,
      pagination: {
        pageSize: Number(this.ProductsPerPage),
        currentPage: Number(this.currentPage) - 1,
      },
      select: mSelect,
      sort: {createdAt: -1},
    };

    this.subDataOne = this.publisherService
      .getAllPublisher(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.publishers = res.data;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private getAllCategory() {
    // Select
    const mSelect = {
      name: 1,
      image: 1,
      mobileImage: 1,
      createdAt: 1,
      serial: 1,
      status: 1,
    };

    const filter: FilterData = {
      filter: this.filter,
      pagination: {
        pageSize: Number(this.ProductsPerPage),
        currentPage: Number(this.currentPage) - 1,
      },
      select: mSelect,
      sort: {createdAt: -1},
    };

    this.subDataOne = this.categoryService
      .getAllCategory(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.categories = res.data;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private deleteMultipleProductById() {
    this.spinner.show();
    this.subDataTwo = this.productService
      .deleteMultipleProductById(this.selectedIds)
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.success) {
            // Get Data array
            const selectedProduct = [];
            this.selectedIds.forEach((id) => {
              const fData = this.products.find((data) => data._id === id);
              if (fData) {
                selectedProduct.push(fData);
              }
            });
            this.selectedIds = [];
            this.uiService.success(res.message);
            // fetch Data
            if (this.currentPage > 1) {
              this.router.navigate([], {queryParams: {page: 1}});
            } else {
              this.getAllProduct();
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



  /**
   * FILTER DATA & Sorting
   * filterData()
   * endChangeRegDateRange()
   * sortData()
   * onPageChanged()
   */

  filterData(value: any, index: number, type: string) {
    switch (type) {
      case 'category': {
        this.filter = {...this.filter, ...{'category._id': value}};
        this.activeFilter1 = index;
        break;
      }
      case 'product': {
        this.filter = {...this.filter, ...{'product._id': value}};
        this.activeFilter2 = index;
        break;
      }
      case 'publishers': {
        this.filter = { ...this.filter, ...{ publishers: value } };
        this.activeFilter3 = index;
        break;
      }
      case 'quantity': {
        this.filter = { ...this.filter, quantity: { $lte: Number(value) } };
        this.activeFilter6 = index;
        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllProduct();
    }
  }

  endChangeRegDateRange(event: MatDatepickerInputEvent<any>) {
    if (event.value) {
      const startDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.start
      );
      const endDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.end
      );

      const qData = {dateString: {$gte: startDate, $lte: endDate}};
      this.filter = {...this.filter, ...qData};
      // const index = this.filter.findIndex(x => x.hasOwnProperty('createdAt'));

      if (this.currentPage > 1) {
        this.router.navigate([], {queryParams: {page: 1}});
      } else {
        this.getAllProduct();
      }
    }
  }

  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllProduct();
  }

  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }
  public SelectChange(data: any) {
    this.ProductsPerPage = data;
    this.selectedPagination = data;
  }

  /**
   * ON Select Check
   * onCheckChange()
   * onAllSelectChange()
   */

  onCheckChange(event: any, index: number, id: string) {
    if (event) {
      this.selectedIds.push(id);
    } else {
      const i = this.selectedIds.findIndex((f) => f === id);
      this.selectedIds.splice(i, 1);
    }
  }

  onAllSelectChange(event: MatCheckboxChange) {
    const currentPageIds = this.products.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.products.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.products.find((f) => f._id === m).select = false;
        const i = this.selectedIds.findIndex((f) => f === m);
        this.selectedIds.splice(i, 1);
      });
    }
  }

  /**
   * EXPORTS TO EXCEL
   * exportToExcel()
   */

  exportToAllExcel() {
    const date = this.utilsService.getDateString(new Date());

    // Select
    const mSelect = {
      image: 1,
      name: 1,
      images: 1,
      createdAt: 1,
      publisher: 1,
      brand: 1,
      costPrice: 1,
      salePrice: 1,
      discountType: 1,
      discountAmount: 1,
      quantity: 1,
      category: 1,
      subCategory: 1,
      unit: 1,
      status: 1,
      threeMonth: 1,
      sixMonth: 1,
      twelveMonth: 1,
    };

    const filterData: FilterData = {
      filter: null,
      select: mSelect,
      sort: this.sortQuery,
    };

    this.subDataOne = this.productService
      .getAllProducts(filterData, this.searchQuery)
      .subscribe({
        next: (res) => {
          const subscriptionReports = res.data;

          const mData = subscriptionReports.map((m) => {
            return {
              // image: m?.image,
              name: m?.name,
              createdAt: this.utilsService.getDateString(m.createdAt),
            };
          });

          // console.warn(mData)
          // EXPORT XLSX
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Data');
          XLSX.writeFile(wb, `Product Reports_${date}.xlsx`);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
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
            this.deleteMultipleProductById();
          }
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * ON REMOVE ALL QUERY
   * onRemoveAllQuery()
   */

  onRemoveAllQuery() {
    this.activeSort = null;
    this.activeFilter1 = null;
    this.activeFilter2 = null;
    this.activeFilter3 = null;
    this.sortQuery = {createdAt: -1};
    this.filter = null;
    this.dataFormDateRange.reset();
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllProduct();
    }
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

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }

    if (this.subRouteTwo) {
      this.subRouteTwo.unsubscribe();
    }

    if (this.subForm) {
      this.subForm.unsubscribe();
    }
    if (this.subReload) {
      this.subReload.unsubscribe();
    }
  }
}
