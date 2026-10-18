import { Component } from '@angular/core';
import { ProductService } from '../../../services/common/product.service';
import { UiService } from '../../../services/core/ui.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-bulk-upload-product',
  templateUrl: './bulk-upload-product.component.html',
  styleUrls: ['./bulk-upload-product.component.scss'],
})
export class BulkUploadProductComponent {
  fileName = '';
  rows: Record<string, any>[] = [];
  overwrite = false;
  result: any = null;

  constructor(
    private readonly productService: ProductService,
    private readonly uiService: UiService,
    private readonly spinner: NgxSpinnerService,
  ) {}

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (!file) {
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['csv', 'xlsx', 'xls'].includes(extension)) {
      this.uiService.warn('Only CSV/XLSX/XLS files are supported');
      return;
    }

    this.fileName = file.name;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary', raw: false });
      const firstSheet = workbook.SheetNames[0];
      if (!firstSheet) {
        this.rows = [];
        return;
      }
      const worksheet = workbook.Sheets[firstSheet];
      this.rows = XLSX.utils.sheet_to_json(worksheet, {
        defval: '',
        raw: false,
      }) as Record<string, any>[];
      this.uiService.success(`${this.rows.length} rows ready for import`);
    };
    reader.readAsBinaryString(file);
  }

  upload(): void {
    if (!this.rows.length) {
      this.uiService.warn('Please choose a file with at least one row');
      return;
    }

    this.spinner.show();
    this.productService.bulkImportProducts(this.rows, this.overwrite).subscribe({
      next: (res) => {
        this.spinner.hide();
        this.result = res.data || null;
        if (res.success && this.result?.created > 0) {
          this.uiService.success(`Import success: ${this.result.created} product(s) created`);
        } else if (res.success && this.result?.updated > 0) {
          this.uiService.success(`Import success: ${this.result.updated} product(s) updated`);
        } else if (this.result?.skipped > 0) {
          this.uiService.warn(`No new product created. Skipped: ${this.result.skipped}`);
        } else if (res.success) {
          this.uiService.success(res.message);
        } else {
          this.uiService.warn(res.message);
        }

        if (this.result?.missingAuthors > 0) {
          this.uiService.warn(
            `${this.result.missingAuthors} row(s) have no authors — fill the authors column in Excel`,
          );
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
        this.uiService.warn('Bulk upload failed');
      },
    });
  }

  downloadTemplate(): void {
    const link = document.createElement('a');
    link.href = '/assets/templates/product-bulk-upload-template.csv';
    link.download = 'product-bulk-upload-template.csv';
    link.click();
  }
}
