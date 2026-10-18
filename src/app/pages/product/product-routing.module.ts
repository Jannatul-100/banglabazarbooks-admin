import { AllProductComponent } from './all-product/all-product.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { LowStockComponent } from './low-stock/low-stock.component';
import {BestSellerProductComponent} from "./best-seller-product/best-seller-product.component";
import { BulkUploadProductComponent } from './bulk-upload-product/bulk-upload-product.component';

const routes: Routes = [
  { path: 'add-product', component: AddProductComponent },
  { path: 'edit-product/:id', component: AddProductComponent },
  { path: 'all-product', component: AllProductComponent },
  { path: 'bulk-upload', component: BulkUploadProductComponent },
  { path: 'low-stock', component: LowStockComponent },
  { path: 'best-seller-product', component: BestSellerProductComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
