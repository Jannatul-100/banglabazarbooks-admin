import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { SettingService } from '../../../services/common/setting.service';
import { ProductService } from '../../../services/common/product.service';
import { UiService } from '../../../services/core/ui.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Setting } from '../../../interfaces/common/setting.interface';
import { Product } from '../../../interfaces/common/product.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-facebook-catalog',
  templateUrl: './facebook-catalog.component.html',
  styleUrls: ['./facebook-catalog.component.scss']
})
export class FacebookCatalogComponent implements OnInit, OnDestroy {
  dataForm!: FormGroup;
  setting?: Setting;
  isLoading = false;

  // Catalog live stats
  catalogCount = 0;
  totalPublished = 0;
  feedCsvUrl = '';
  feedXmlUrl = '';

  // Books in Catalog
  catalogProducts: Product[] = [];
  catalogPage = 1;
  catalogPageSize = 10;
  totalCatalogItems = 0;
  isCatalogLoading = false;

  // Search to Add Books
  searchQuery = '';
  searchResults: Product[] = [];
  isSearching = false;

  private subDataOne?: Subscription;
  private subDataTwo?: Subscription;
  private subDataThree?: Subscription;
  private subProducts?: Subscription;
  private subSearch?: Subscription;

  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
    private productService: ProductService,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getSetting();
    this.getCatalogStatus();
    this.loadCatalogProducts();
  }

  private initForm(): void {
    this.dataForm = this.fb.group({
      isEnableFacebookCatalog: [false],
    });
  }

  private getSetting(): void {
    this.subDataOne = this.settingService.getSetting().subscribe({
      next: (res) => {
        if (res.data) {
          this.setting = res.data;
          const isEnabled = res.data.facebookCatalog?.isEnableFacebookCatalog ?? false;
          this.dataForm.patchValue({
            isEnableFacebookCatalog: isEnabled,
          });
        }
      },
      error: (err) => {
        console.error('Error fetching setting:', err);
      }
    });
  }

  getCatalogStatus(): void {
    this.subDataThree = this.settingService.getFacebookCatalogStatus().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.catalogCount = res.data.catalogCount ?? 0;
          this.totalPublished = res.data.totalPublished ?? 0;
          this.feedCsvUrl = res.data.feedCsvUrl || `${environment.apiBaseLink}/api/facebook-catalog/datafeed.csv`;
          this.feedXmlUrl = res.data.feedXmlUrl || `${environment.apiBaseLink}/api/facebook-catalog/datafeed.xml`;
        }
      },
      error: () => {
        this.feedCsvUrl = `${environment.apiBaseLink}/api/facebook-catalog/datafeed.csv`;
        this.feedXmlUrl = `${environment.apiBaseLink}/api/facebook-catalog/datafeed.xml`;
      }
    });
  }

  loadCatalogProducts(page = 1): void {
    this.catalogPage = page;
    this.isCatalogLoading = true;

    const filterData: any = {
      filter: {
        status: 'publish',
        isFacebookCatalog: true,
      },
      pagination: {
        pageSize: this.catalogPageSize,
        currentPage: this.catalogPage,
      },
      select: 'name images salePrice regularPrice isFacebookCatalog status publisher category slug',
      sort: { createdAt: -1 },
    };

    this.subProducts = this.productService.getAllProducts(filterData).subscribe({
      next: (res) => {
        this.isCatalogLoading = false;
        if (res.success) {
          this.catalogProducts = res.data || [];
          this.totalCatalogItems = res.count || 0;
        }
      },
      error: (err) => {
        this.isCatalogLoading = false;
        console.error('Failed to load catalog products', err);
      }
    });
  }

  onSearchBooks(): void {
    const q = this.searchQuery?.trim();
    if (!q) {
      this.searchResults = [];
      return;
    }

    this.isSearching = true;
    const filterData: any = {
      filter: {
        status: 'publish',
      },
      pagination: {
        pageSize: 6,
        currentPage: 1,
      },
      select: 'name images salePrice regularPrice isFacebookCatalog status publisher',
    };

    this.subSearch = this.productService.getAllProducts(filterData, q).subscribe({
      next: (res) => {
        this.isSearching = false;
        if (res.success) {
          this.searchResults = res.data || [];
        }
      },
      error: (err) => {
        this.isSearching = false;
        console.error('Search error', err);
      }
    });
  }

  addBookToCatalog(product: Product): void {
    this.productService.updateProductById(product._id, { isFacebookCatalog: true } as Product).subscribe({
      next: (res) => {
        if (res.success) {
          product.isFacebookCatalog = true;
          this.uiService.success(`"${product.name}" added to Facebook Catalog!`);
          this.getCatalogStatus();
          this.loadCatalogProducts(this.catalogPage);
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: (err) => {
        console.error(err);
        this.uiService.warn('Failed to add book to catalog');
      }
    });
  }

  removeBookFromCatalog(product: Product): void {
    this.productService.updateProductById(product._id, { isFacebookCatalog: false } as Product).subscribe({
      next: (res) => {
        if (res.success) {
          product.isFacebookCatalog = false;
          this.uiService.success(`"${product.name}" removed from Facebook Catalog`);
          this.getCatalogStatus();
          this.loadCatalogProducts(this.catalogPage);
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: (err) => {
        console.error(err);
        this.uiService.warn('Failed to remove book from catalog');
      }
    });
  }

  onToggle(): void {
    this.onSubmit();
  }

  onSubmit(): void {
    this.isLoading = true;
    this.spinner.show();

    const isEnable = this.dataForm.value.isEnableFacebookCatalog;

    const payload: Setting = {
      facebookCatalog: {
        isEnableFacebookCatalog: isEnable,
      },
    };

    this.subDataTwo = this.settingService.updateSetting(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.spinner.hide();
        if (res.success) {
          this.uiService.success(res.message || 'Facebook Catalog settings updated successfully');
          this.getCatalogStatus();
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.spinner.hide();
        console.error(err);
        this.uiService.warn('Failed to update Facebook Catalog settings');
      }
    });
  }

  onCopy(url: string, typeName = 'URL'): void {
    if (!url) return;
    this.clipboard.copy(url);
    this.uiService.success(`${typeName} copied to clipboard!`);
  }

  ngOnDestroy(): void {
    if (this.subDataOne) this.subDataOne.unsubscribe();
    if (this.subDataTwo) this.subDataTwo.unsubscribe();
    if (this.subDataThree) this.subDataThree.unsubscribe();
    if (this.subProducts) this.subProducts.unsubscribe();
    if (this.subSearch) this.subSearch.unsubscribe();
  }
}
