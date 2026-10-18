import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TagService } from '../../../../services/common/tag.service';
import { UiService } from '../../../../services/core/ui.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from '../../../../services/common/product.service';
import { FilterData } from '../../../../interfaces/gallery/filter-data';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-manage-tag-books-dialog',
  templateUrl: './manage-tag-books-dialog.component.html',
  styleUrls: ['./manage-tag-books-dialog.component.scss'],
})
export class ManageTagBooksDialogComponent implements OnInit {
  searchSubject = new Subject<string>();
  tagId: string;
  tagName: string;
  products: any[] = [];
  allProducts: any[] = [];
  selectedProductIds: string[] = [];
  isLoadingProducts = false;
  isLoadingAll = false;
  showAddPanel = false;
  searchTerm = '';
  filteredAllProducts: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tagId: string; tagName: string },
    private dialogRef: MatDialogRef<ManageTagBooksDialogComponent>,
    private tagService: TagService,
    private productService: ProductService,
    private uiService: UiService,
    private spinner: NgxSpinnerService
  ) {
    this.tagId = data.tagId;
    this.tagName = data.tagName;
  }

  currentSearchTerm = '';

  get filteredProducts(): any[] {
    if (!this.currentSearchTerm || !this.currentSearchTerm.trim()) {
      return this.products;
    }
    const q = this.currentSearchTerm.trim().toLowerCase();
    return this.products.filter(p =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
      (p.author && p.author.some((a: any) => a.name && a.name.toLowerCase().includes(q)))
    );
  }

  ngOnInit(): void {
    this.loadTagProducts();
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.loadAllProducts();
    });
  }

  loadTagProducts() {
    this.isLoadingProducts = true;
    this.tagService.getProductsByTagId(this.tagId, 1, 1000).subscribe({
      next: (res) => {
        this.isLoadingProducts = false;
        if (res.success) {
          this.products = res.data || [];
        }
      },
      error: () => {
        this.isLoadingProducts = false;
      },
    });
  }

  removeProduct(productId: string) {
    this.spinner.show();
    this.tagService.removeProductFromTag(this.tagId, productId).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res.success) {
          this.uiService.success(res.message || 'Book removed from tag');
          this.products = this.products.filter((p) => p._id !== productId);
          // Also unselect if selected in add panel
          this.selectedProductIds = this.selectedProductIds.filter((id) => id !== productId);
          this.filterAllProducts();
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: () => {
        this.spinner.hide();
        this.uiService.warn('Failed to remove book');
      },
    });
  }

  openAddPanel() {
    this.showAddPanel = true;
    if (this.allProducts.length === 0) {
      this.loadAllProducts();
    } else {
      this.filterAllProducts();
    }
  }

  loadAllProducts() {
    this.isLoadingAll = true;
    const filterData: FilterData = {
      pagination: { currentPage: 1, pageSize: 100 },
      filter: null,
      select: { name: 1, images: 1, salePrice: 1, author: 1, category: 1 },
      sort: { name: 1 },
    };
    const search = this.searchTerm && this.searchTerm.trim() ? this.searchTerm.trim() : null;
    this.productService.getAllProducts(filterData, search).subscribe({
      next: (res) => {
        this.isLoadingAll = false;
        if (res.success) {
          this.allProducts = res.data || [];
          this.filterAllProducts();
        }
      },
      error: () => {
        this.isLoadingAll = false;
      },
    });
  }

  filterAllProducts() {
    const existingIds = new Set(this.products.map((p) => String(p._id)));
    this.filteredAllProducts = this.allProducts.filter((p) => !existingIds.has(String(p._id)));
  }

  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  toggleSelectProduct(productId: string) {
    const idx = this.selectedProductIds.indexOf(productId);
    if (idx === -1) {
      this.selectedProductIds.push(productId);
    } else {
      this.selectedProductIds.splice(idx, 1);
    }
  }

  isSelected(productId: string): boolean {
    return this.selectedProductIds.includes(productId);
  }

  addSelectedProducts() {
    if (!this.selectedProductIds.length) {
      this.uiService.warn('কোনো বই সিলেক্ট করুন');
      return;
    }
    this.spinner.show();
    this.tagService.addProductsToTag(this.tagId, this.selectedProductIds).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res.success) {
          this.uiService.success(res.message || 'Books added to tag');
          this.selectedProductIds = [];
          this.showAddPanel = false;
          this.loadTagProducts();
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: () => {
        this.spinner.hide();
        this.uiService.warn('Failed to add books');
      },
    });
  }

  close() {
    this.dialogRef.close();
  }
}
