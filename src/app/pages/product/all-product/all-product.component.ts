import {Component, OnInit, ViewChild} from '@angular/core';
import {UiService} from '../../../services/core/ui.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ReloadService} from '../../../services/core/reload.service';
import {EMPTY, Subscription} from 'rxjs';
import {FilterData} from '../../../interfaces/gallery/filter-data';
import {Product} from '../../../interfaces/common/product.interface';
import {ProductService} from '../../../services/common/product.service';
import {AdminPermissions} from 'src/app/enum/admin-permission.enum';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {UtilsService} from '../../../services/core/utils.service';
import {debounceTime, distinctUntilChanged, pluck, switchMap,} from 'rxjs/operators';
import {Pagination} from '../../../interfaces/core/pagination';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import * as XLSX from 'xlsx';
import {MatDialog} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {BulkApplyTagDialogComponent} from '../../../shared/dialog-view/bulk-apply-tag-dialog/bulk-apply-tag-dialog.component';
import {FileUploadService} from '../../../services/gallery/file-upload.service';
import {Category} from "../../../interfaces/common/category.interface";
import {Brand} from "../../../interfaces/common/brand.interface";
import {CategoryService} from "../../../services/common/category.service";
import {Publisher} from "../../../interfaces/common/publisher.interface";
import {PublisherService} from "../../../services/common/publisher.service";
import {Author} from "../../../interfaces/common/author.interface";
import {AuthorService} from "../../../services/common/author.service";
import {AdminService} from '../../../services/admin/admin.service';

@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.scss'],
})
export class AllProductComponent implements OnInit {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[] = [];
  selectedPagination = 0;
  isPublisher = false;
  isSuperAdmin = false;
  activeApprovalTab = 'all';
  loggedInPublisher: any = null;

  // Store Data
  toggleMenu: boolean = false;
  products: Product[] = [];
  holdPrevData: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: string = null;
  selectedCategoryName: string = null;
  brands: Brand[] = [];
  publishers: Publisher[] = [];
  filteredPublishers: Publisher[] = [];
  selectedPublisherId: string = null;
  selectedPublisherName: string = null;
  publisherSearchTerm: string = '';
  authors: Author[] = [];
  filteredAuthors: Author[] = [];
  selectedAuthorId: string = null;
  selectedAuthorName: string = null;
  authorSearchTerm: string = '';
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
  private subDataProduct: Subscription;
  private subDataCategory: Subscription;
  private subDataPublisher: Subscription;
  private subDataAuthor: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subRouteTwo: Subscription;
  private subForm: Subscription;
  private subRouteOne: Subscription;
  private subReload: Subscription;
  private subDataEight: Subscription;
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
    private authorService: AuthorService,
    private adminService: AdminService,
  ) {
  }

  ngOnInit(): void {
    this.adminId = this.adminService.getAdminId();
    this.role = this.adminService.getAdminRole();
    this.isPublisher = this.role === 'publisher';
    this.isSuperAdmin = this.role === 'super_admin' || this.role === 'admin';
    this.permissions = this.adminService.getAdminPermissions() || [];
    this.loggedInPublisher = this.adminService.getAdminPublisher();

    // Reload
    this.subReload = this.reloadService.refreshBrand$.subscribe(() => {
      this.getAllProduct();
    });

    // Load Filter State from Session Storage
    const savedFilterStr = sessionStorage.getItem('allProductFilter');
    if (savedFilterStr) {
      try {
        const savedData = JSON.parse(savedFilterStr);
        this.filter = savedData.filter || null;
        this.activeFilter1 = savedData.activeFilter1 !== undefined ? savedData.activeFilter1 : null;
        this.activeFilter2 = savedData.activeFilter2 !== undefined ? savedData.activeFilter2 : null;
        this.activeFilter3 = savedData.activeFilter3 !== undefined ? savedData.activeFilter3 : null;
        this.activeFilter6 = savedData.activeFilter6 !== undefined ? savedData.activeFilter6 : null;
        this.selectedCategoryId = savedData.selectedCategoryId || null;
        this.selectedCategoryName = savedData.selectedCategoryName || null;
        this.selectedPublisherId = savedData.selectedPublisherId || null;
        this.selectedPublisherName = savedData.selectedPublisherName || null;
        this.selectedAuthorId = savedData.selectedAuthorId || null;
        this.selectedAuthorName = savedData.selectedAuthorName || null;
        this.activeApprovalTab = savedData.activeApprovalTab || 'all';
        this.activeSort = savedData.activeSort;
        this.sortQuery = savedData.sortQuery || {createdAt: -1};
        if (savedData.currentPage && savedData.currentPage > 1) {
          this.currentPage = savedData.currentPage;
        }
      } catch (e) {}
    }

    if (this.isPublisher) {
      if (this.loggedInPublisher?._id) {
        this.filter = {
          ...(this.filter || {}),
          'publisher._id': this.loggedInPublisher._id,
        };
        this.listenRouteAndFetch();
      } else {
        this.adminService.getLoggedInAdminData().subscribe({
          next: (res) => {
            if (res?.data?.publisher?._id) {
              this.loggedInPublisher = res.data.publisher;
              this.filter = {
                ...(this.filter || {}),
                'publisher._id': this.loggedInPublisher._id,
              };
            }
            this.listenRouteAndFetch();
          },
          error: () => {
            this.listenRouteAndFetch();
          }
        });
      }
    } else {
      this.listenRouteAndFetch();
    }

    this.getAllCategory();
    this.getAllPublisher();
    this.getAllAuthor();
  }

  private listenRouteAndFetch() {
    if (this.subRouteOne) {
      return;
    }
    this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
      } else if (!this.currentPage) {
        this.currentPage = 1;
      }
      this.getAllProduct();
    });
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
          const trimmed = (data || '').trim();
          if (!trimmed) {
            if (this.searchQuery) {
              this.searchQuery = null;
              this.searchProduct = [];
              this.products = this.holdPrevData;
              this.totalProducts = this.totalProductsStore;
            }
            return EMPTY;
          }
          this.searchQuery = trimmed;
          const pagination: Pagination = {
            pageSize: Number(this.ProductsPerPage),
            currentPage: 0,
          };

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
            status: 1,
            threeMonth: 1,
            sixMonth: 1,
            twelveMonth: 1,
          };

          let finalFilter = this.filter;
          if (this.isPublisher && this.loggedInPublisher?._id) {
            finalFilter = {
              ...(finalFilter || {}),
              'publisher._id': this.loggedInPublisher._id,
            };
          }

          const filterData: FilterData = {
            pagination: pagination,
            filter: finalFilter,
            select: mSelect,
            sort: this.sortQuery,
          };

          return this.productService.getAllProducts(
            filterData,
            this.searchQuery
          );
        })
      )
      .subscribe({
        next: (res: any) => {
          this.searchProduct = res.data;
          this.products = this.searchProduct;
          this.totalProducts = res.count;
          this.currentPage = 1;
          this.router.navigate([], {queryParams: {page: this.currentPage}});
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  /**
   * CHECK ADMIN PERMISSION
   * getAdminBaseData()
   * onSelectShowPerPage()
   * checkAddPermission
   * checkEditPermission
   * checkDeletePermission
   */
  private getAdminBaseData() {
    this.adminId = this.adminService.getAdminId();
    this.role = this.adminService.getAdminRole();
    this.isPublisher = this.role === 'publisher';
    this.isSuperAdmin = this.role === 'super_admin' || this.role === 'admin';
    this.permissions = this.adminService.getAdminPermissions() || [];
    this.loggedInPublisher = this.adminService.getAdminPublisher();

    if (this.isPublisher) {
      if (this.loggedInPublisher?._id) {
        this.filter = {
          ...(this.filter || {}),
          'publisher._id': this.loggedInPublisher._id,
        };
      } else {
        this.adminService.getLoggedInAdminData().subscribe({
          next: (res) => {
            if (res?.data?.publisher?._id) {
              this.loggedInPublisher = res.data.publisher;
              this.filter = {
                ...(this.filter || {}),
                'publisher._id': this.loggedInPublisher._id,
              };
              this.getAllProduct();
            }
          },
        });
      }
    }
  }

  onSelectShowPerPage(val) {
    this.ProductsPerPage = val;
    this.getAllProduct();
  }

  get checkAddPermission(): boolean {
    if (this.isPublisher) {
      return true;
    }
    return this.permissions.includes(AdminPermissions.CREATE);
  }

  get checkEditPermission(): boolean {
    if (this.isPublisher) {
      return true;
    }
    return this.permissions.includes(AdminPermissions.EDIT);
  }

  get checkDeletePermission(): boolean {
    if (this.isPublisher) {
      return false;
    }
    return this.permissions.includes(AdminPermissions.DELETE);
  }

  onApproveProduct(id: string) {
    this.spinner.show();
    this.productService.approveProduct(id).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res.success) {
          this.uiService.success(res.message || 'Product approved and published!');
          this.getAllProduct();
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.uiService.wrong(err?.error?.message || 'Approval failed');
      },
    });
  }

  onRejectProduct(id: string) {
    this.spinner.show();
    this.productService.rejectProduct(id).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res.success) {
          this.uiService.warn(res.message || 'Product rejected');
          this.getAllProduct();
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.uiService.wrong(err?.error?.message || 'Rejection failed');
      },
    });
  }

  onApprovePrice(id: string) {
    this.spinner.show();
    this.productService.approvePrice(id).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res.success) {
          this.uiService.success(res.message || 'Price update approved!');
          this.getAllProduct();
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.uiService.wrong(err?.error?.message || 'Price approval failed');
      },
    });
  }

  onRejectPrice(id: string) {
    this.spinner.show();
    this.productService.rejectPrice(id).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res.success) {
          this.uiService.warn(res.message || 'Price update rejected');
          this.getAllProduct();
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.uiService.wrong(err?.error?.message || 'Price rejection failed');
      },
    });
  }

  onFilterApproval(type: string) {
    this.activeApprovalTab = type;
    this.currentPage = 1;
    let baseFilter: any = null;
    if (type === 'pending_books') {
      baseFilter = { approvalStatus: 'pending' };
    } else if (type === 'pending_prices') {
      baseFilter = { 'pendingPriceUpdate.status': 'pending' };
    } else if (type === 'all_pending') {
      baseFilter = {
        $or: [
          { approvalStatus: 'pending' },
          { 'pendingPriceUpdate.status': 'pending' },
        ],
      };
    }

    if (this.isPublisher && this.loggedInPublisher?._id) {
      this.filter = {
        ...(baseFilter || {}),
        'publisher._id': this.loggedInPublisher._id,
      };
    } else {
      this.filter = baseFilter;
    }
    this.saveFilterState();
    this.getAllProduct();
  }

  generateAllBookPreviews() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '520px',
      width: '100%',
      data: {
        title: 'Generate Book Previews',
        message:
          'This will read each book PDF on the server, convert every page to WebP preview images, save them under upload/images, and update the database. Books that already have valid preview files on this server will be skipped. Run this on the production API server. Continue?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.spinner.show();
      this.productService.generateAllBookPreviews(true).subscribe({
        next: (res) => {
          this.spinner.hide();
          if (res.success) {
            this.uiService.success(res.message);
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
          this.uiService.warn('Failed to start book preview generation');
        },
      });
    });
  }

  regenerateAllBookPreviews() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '560px',
      width: '100%',
      data: {
        title: 'Regenerate All Book Previews',
        message:
          'This will DELETE all existing book preview image files and clear saved preview URLs from every book. Then it will generate fresh preview images from each PDF and save new URLs. This may take a long time. Continue?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.spinner.show();
      this.productService.regenerateAllBookPreviews().subscribe({
        next: (res) => {
          this.spinner.hide();
          if (res.success) {
            this.uiService.success(res.message);
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
          this.uiService.warn('Failed to regenerate book previews');
        },
      });
    });
  }

  fixPreviewImageUrls() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '520px',
      width: '100%',
      data: {
        title: 'Fix Preview Image URLs',
        message:
          'This will update all saved preview image links to use https://ftp.banglabazarbooks.com instead of localhost or wrong domains. This does NOT create image files on the server. After this, run Generate Book Previews on the production server. Continue?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.spinner.show();
      this.productService.fixPreviewImageUrls().subscribe({
        next: (res) => {
          this.spinner.hide();
          if (res.success) {
            this.uiService.success(res.message);
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
          this.uiService.warn('Failed to fix preview image URLs');
        },
      });
    });
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
      status: 1,
      threeMonth: 1,
      sixMonth: 1,
      twelveMonth: 1,
    };

    const pagination: Pagination = {
      pageSize: Number(this.ProductsPerPage),
      currentPage: Number(this.currentPage) - 1,
    };

    let finalFilter = this.filter;
    if (this.isPublisher && this.loggedInPublisher?._id) {
      finalFilter = {
        ...(finalFilter || {}),
        'publisher._id': this.loggedInPublisher._id,
      };
    }

    const filter: FilterData = {
      filter: finalFilter,
      pagination: pagination,
      select: mSelect,
      sort: this.sortQuery,
    };

    this.subDataProduct = this.productService
      .getAllProducts(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.products = res.data;
            this.productCount = res.count;
            this.holdPrevData = this.products;
            this.totalProductsStore = this.productCount;
            this.totalProducts = this.productCount;

            if (this.products?.length) {
              this.products.forEach((product, index) => {
                const selected = this.selectedIds.includes(product._id);
                this.products[index].select = selected;
              });
              this.checkSelectionData();
            }
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
      filter: null,
      pagination: null,
      select: mSelect,
      sort: { name: 1 },
    };

    this.subDataPublisher = this.publisherService
      .getAllPublisher(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.publishers = res.data || [];
            this.filteredPublishers = this.publishers;
            if (this.selectedPublisherId) {
              if (!this.selectedPublisherName) {
                this.selectedPublisherName =
                  this.publishers.find((p) => p._id === this.selectedPublisherId)?.name || 'Publishers';
              }
              this.activeFilter3 = this.publishers.findIndex((p) => p._id === this.selectedPublisherId);
            } else if (this.activeFilter3 !== null && this.publishers[this.activeFilter3]) {
              this.selectedPublisherId = this.publishers[this.activeFilter3]._id;
              this.selectedPublisherName = this.publishers[this.activeFilter3].name;
            }
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
      filter: null,
      pagination: null,
      select: mSelect,
      sort: { createdAt: -1 },
    };

    this.subDataCategory = this.categoryService
      .getAllCategory(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.categories = res.data || [];
            if (this.selectedCategoryId) {
              if (!this.selectedCategoryName) {
                this.selectedCategoryName =
                  this.categories.find((c) => c._id === this.selectedCategoryId)?.name || 'Category';
              }
              this.activeFilter1 = this.categories.findIndex((c) => c._id === this.selectedCategoryId);
            } else if (this.activeFilter1 !== null && this.categories[this.activeFilter1]) {
              this.selectedCategoryId = this.categories[this.activeFilter1]._id;
              this.selectedCategoryName = this.categories[this.activeFilter1].name;
            }
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private getAllAuthor() {
    const mSelect = {
      name: 1,
      nameEn: 1,
      createdAt: 1,
    };

    const filter: FilterData = {
      filter: null,
      pagination: null,
      select: mSelect,
      sort: { name: 1 },
    };

    this.subDataAuthor = this.authorService
      .getAllAuthor(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.authors = res.data || [];
            this.filteredAuthors = this.authors;
            if (this.selectedAuthorId && !this.selectedAuthorName) {
              this.selectedAuthorName = this.authors.find(a => a._id === this.selectedAuthorId)?.name || 'Author';
            }
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

  private updateMultipleProductById(data: Record<string, any>) {
    this.spinner.show();
    this.subDataTwo = this.productService
      .updateMultipleProductById(this.selectedIds, data as Product)
      .subscribe({
        next: (res) => {
          this.spinner.hide();
          if (res.success) {
            this.selectedIds = [];
            this.uiService.success(res.message);
            this.reloadService.needRefreshData$();
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
        },
      });
  }

  private bulkAddTagsToProducts(tagIds: string[]) {
    this.spinner.show();
    this.subDataThree = this.productService
      .bulkAddTagsToProducts(this.selectedIds, tagIds)
      .subscribe({
        next: (res) => {
          this.spinner.hide();
          if (res.success) {
            this.selectedIds = [];
            this.uiService.success(res.message);
            this.reloadService.needRefreshData$();
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
          this.uiService.warn('Failed to apply tags');
        },
      });
  }



  /**
   * FILTER DATA & Sorting
   * filterData()
   * endChangeRegDateRange()
   * sortData()
   * onPageChanged()
   */

  private saveFilterState() {
    sessionStorage.setItem('allProductFilter', JSON.stringify({
      filter: this.filter,
      activeFilter1: this.activeFilter1,
      activeFilter2: this.activeFilter2,
      activeFilter3: this.activeFilter3,
      activeFilter6: this.activeFilter6,
      selectedCategoryId: this.selectedCategoryId,
      selectedCategoryName: this.selectedCategoryName,
      selectedPublisherId: this.selectedPublisherId,
      selectedPublisherName: this.selectedPublisherName,
      selectedAuthorId: this.selectedAuthorId,
      selectedAuthorName: this.selectedAuthorName,
      activeApprovalTab: this.activeApprovalTab,
      activeSort: this.activeSort,
      sortQuery: this.sortQuery,
      currentPage: this.currentPage,
    }));
  }

  filterData(value: any, index: any, type: string) {
    switch (type) {
      case 'category': {
        this.filter = {...this.filter, ...{'category._id': value}};
        this.selectedCategoryId = value;
        this.selectedCategoryName = (index && index.name)
          ? index.name
          : this.categories.find(c => c._id === value)?.name || 'Category';
        this.activeFilter1 = typeof index === 'number'
          ? index
          : this.categories.findIndex(c => c._id === value);
        break;
      }
      case 'product': {
        this.filter = {...this.filter, ...{'product._id': value}};
        this.activeFilter2 = index;
        break;
      }
      case 'publishers': {
        this.filter = { ...this.filter, ...{ 'publisher._id': value } };
        this.selectedPublisherId = value;
        this.selectedPublisherName = (index && index.name)
          ? index.name
          : this.publishers.find(p => p._id === value)?.name || 'Publishers';
        this.activeFilter3 = typeof index === 'number'
          ? index
          : this.publishers.findIndex(p => p._id === value);
        break;
      }
      case 'author': {
        this.filter = { ...this.filter, ...{ 'author._id': value } };
        this.selectedAuthorId = value;
        this.selectedAuthorName = (index && index.name)
          ? index.name
          : this.authors.find(a => a._id === value)?.name || 'Author';
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
    this.saveFilterState();
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllProduct();
    }
  }

  clearAuthorFilter() {
    this.selectedAuthorId = null;
    this.selectedAuthorName = null;
    this.authorSearchTerm = '';
    this.filteredAuthors = this.authors;
    if (this.filter && this.filter['author._id']) {
      const { ['author._id']: _, ...rest } = this.filter;
      this.filter = Object.keys(rest).length ? rest : null;
    }
    this.saveFilterState();
    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } });
    } else {
      this.getAllProduct();
    }
  }

  onAuthorSearchChange(event?: any) {
    const term = (this.authorSearchTerm || '').trim().toLowerCase();
    if (!term) {
      this.filteredAuthors = this.authors;
      return;
    }
    this.filteredAuthors = this.authors.filter((author) => {
      const nameBn = (author?.name || '').toLowerCase();
      const nameEn = (author?.nameEn || '').toLowerCase();
      return nameBn.includes(term) || nameEn.includes(term);
    });
  }

  clearPublisherFilter() {
    this.selectedPublisherId = null;
    this.selectedPublisherName = null;
    this.publisherSearchTerm = '';
    this.filteredPublishers = this.publishers;
    this.activeFilter3 = null;
    if (this.filter && this.filter['publisher._id']) {
      const { ['publisher._id']: _, ...rest } = this.filter;
      this.filter = Object.keys(rest).length ? rest : null;
    }
    this.saveFilterState();
    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } });
    } else {
      this.getAllProduct();
    }
  }

  onPublisherSearchChange(event?: any) {
    const term = (this.publisherSearchTerm || '').trim().toLowerCase();
    if (!term) {
      this.filteredPublishers = this.publishers;
      return;
    }
    this.filteredPublishers = this.publishers.filter((pub) => {
      const nameBn = (pub?.name || '').toLowerCase();
      const nameEn = ((pub as any)?.nameEn || '').toLowerCase();
      return nameBn.includes(term) || nameEn.includes(term);
    });
  }

  clearCategoryFilter() {
    this.selectedCategoryId = null;
    this.selectedCategoryName = null;
    this.activeFilter1 = null;
    if (this.filter && this.filter['category._id']) {
      const { ['category._id']: _, ...rest } = this.filter;
      this.filter = Object.keys(rest).length ? rest : null;
    }
    this.saveFilterState();
    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } });
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
      this.saveFilterState();

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
    this.saveFilterState();
    this.getAllProduct();
  }

  public onPageChanged(event: any) {
    this.currentPage = Number(event);
    this.saveFilterState();
    this.router.navigate([], {
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
    });
    this.getAllProduct();
  }
  public SelectChange(data: any) {
    this.ProductsPerPage = Number(data);
    this.selectedPagination = Number(data);
    this.currentPage = 1;
    this.router.navigate([], {
      queryParams: { page: 1 },
      queryParamsHandling: 'merge',
    });
    this.getAllProduct();
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

  clearSelection() {
    this.selectedIds = [];
    this.products.forEach((product) => {
      product.select = false;
    });
    if (this.matCheckbox) {
      this.matCheckbox.checked = false;
    }
  }

  private checkSelectionData() {
    if (!this.products?.length || !this.matCheckbox) {
      return;
    }

    const isAllSelect = this.products.every((product) => product.select);
    this.matCheckbox.checked = isAllSelect;
  }

  openBulkApplyTagDialog() {
    if (!this.selectedIds.length) {
      this.uiService.warn('Please select at least one product');
      return;
    }

    const dialogRef = this.dialog.open(BulkApplyTagDialogComponent, {
      width: '95%',
      maxWidth: '480px',
      data: { count: this.selectedIds.length },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.tagIds?.length) {
        this.bulkAddTagsToProducts(result.tagIds);
      }
    });
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
      author: 1,
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
              _id: m?._id ? String(m._id) : '',
              name: m?.name,
              category: m?.category?.name || '',
              sub_category: m?.subCategory?.name || '',
              publisher: m?.publisher?.name || '',
              authors: m?.author?.length ? m.author.map(a => a.name).join(', ') : '',
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
  public openConfirmDialog(type: string,data?: any) {
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
      case 'clone': {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: '400px',
          data: {
            title: 'Confirm Clone',
            message: 'Are you sure you want clone this data?'
          }
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult) {
            this.cloneSingleProduct(data);
          }
        });
        break;
      }
      case 'edit': {
        const statusLabel = data?.status === 'publish' ? 'Publish' : 'Draft';
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: '400px',
          data: {
            title: 'Confirm Status Change',
            message: `Change ${this.selectedIds.length} product(s) to ${statusLabel}?`,
          },
        });
        dialogRef.afterClosed().subscribe((dialogResult) => {
          if (dialogResult) {
            this.updateMultipleProductById({ status: data.status });
          }
        });
        break;
      }
      case 'fbCatalog': {
        const isAdd = !!data?.isFacebookCatalog;
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: '400px',
          data: {
            title: isAdd ? 'Add to Facebook Catalog' : 'Remove from Facebook Catalog',
            message: isAdd
              ? `Add ${this.selectedIds.length} selected book(s) to Facebook Catalog?`
              : `Remove ${this.selectedIds.length} selected book(s) from Facebook Catalog?`,
          },
        });
        dialogRef.afterClosed().subscribe((dialogResult) => {
          if (dialogResult) {
            this.updateMultipleProductById({ isFacebookCatalog: isAdd });
          }
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  onToggleFbCatalog(product: Product, event: any) {
    const isChecked = event.checked;
    this.productService.updateProductById(product._id, { isFacebookCatalog: isChecked } as Product).subscribe({
      next: (res) => {
        if (res.success) {
          product.isFacebookCatalog = isChecked;
          this.uiService.success(isChecked ? 'Book added to Facebook Catalog' : 'Book removed from Facebook Catalog');
        } else {
          this.uiService.warn(res.message);
          this.reloadService.needRefreshData$();
        }
      },
      error: (err) => {
        console.error(err);
        this.uiService.warn('Failed to update Facebook Catalog status');
        this.reloadService.needRefreshData$();
      }
    });
  }

  private cloneSingleProduct(id: string) {
    this.spinner.show();
    this.subDataEight = this.productService.cloneSingleProduct(id)
      .subscribe(res => {
        this.spinner.hide();
        if (res.success) {
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
   * ON REMOVE ALL QUERY
   * onRemoveAllQuery()
   */

  get hasActiveFilter(): boolean {
    if (this.activeSort !== null && this.activeSort !== undefined) {
      return true;
    }
    if (
      this.activeFilter1 !== null ||
      this.activeFilter2 !== null ||
      this.activeFilter3 !== null ||
      this.activeFilter6 !== null
    ) {
      return true;
    }
    if (this.selectedAuthorId) {
      return true;
    }
    if (this.selectedPublisherId) {
      return true;
    }
    if (this.selectedCategoryId) {
      return true;
    }
    if (
      this.dataFormDateRange &&
      (this.dataFormDateRange.value.start || this.dataFormDateRange.value.end)
    ) {
      return true;
    }
    if (this.activeApprovalTab && this.activeApprovalTab !== 'all') {
      return true;
    }
    if (this.filter) {
      if (this.isPublisher) {
        const nonPublisherKeys = Object.keys(this.filter).filter(
          (k) => k !== 'publisher._id'
        );
        return nonPublisherKeys.length > 0;
      }
      return Object.keys(this.filter).length > 0;
    }
    return false;
  }

  getAuthorNames(author: any[]): string {
    if (!author || !author.length) {
      return 'N/A';
    }
    return author.map((a) => a?.name).filter(Boolean).join(', ');
  }

  onRemoveAllQuery() {
    this.activeSort = null;
    this.activeFilter1 = null;
    this.activeFilter2 = null;
    this.activeFilter3 = null;
    this.activeFilter6 = null;
    this.selectedCategoryId = null;
    this.selectedCategoryName = null;
    this.selectedPublisherId = null;
    this.selectedPublisherName = null;
    this.publisherSearchTerm = '';
    this.filteredPublishers = this.publishers;
    this.selectedAuthorId = null;
    this.selectedAuthorName = null;
    this.authorSearchTerm = '';
    this.filteredAuthors = this.authors;
    this.activeApprovalTab = 'all';
    this.sortQuery = {createdAt: -1};
    this.filter = (this.isPublisher && this.loggedInPublisher?._id)
      ? { 'publisher._id': this.loggedInPublisher._id }
      : null;
    this.dataFormDateRange.reset();
    sessionStorage.removeItem('allProductFilter');
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
    if (this.subDataProduct) {
      this.subDataProduct.unsubscribe();
    }
    if (this.subDataCategory) {
      this.subDataCategory.unsubscribe();
    }
    if (this.subDataPublisher) {
      this.subDataPublisher.unsubscribe();
    }
    if (this.subDataAuthor) {
      this.subDataAuthor.unsubscribe();
    }
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

    if (this.subForm) {
      this.subForm.unsubscribe();
    }
    if (this.subReload) {
      this.subReload.unsubscribe();
    }
    if (this.subDataEight) {
      this.subDataEight.unsubscribe();
    }
  }
}
