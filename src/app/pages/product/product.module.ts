import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProductRoutingModule} from './product-routing.module';
import {AllProductComponent} from './all-product/all-product.component';
import {AddProductComponent} from './add-product/add-product.component';


import {FormsModule} from '@angular/forms';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {NgxPaginationModule} from 'ngx-pagination';
import {MaterialModule} from 'src/app/material/material.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {PipesModule} from 'src/app/shared/pipes/pipes.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {AuthorSelectModule} from '../../shared/lazy/author-select/author-select.module';
import {TranslatorSelectModule} from '../../shared/lazy/translator-select/translator-select.module';
import {PublisherSelectModule} from "../../shared/lazy/publisher-select/publisher-select.module";
import {CategorySelectModule} from '../../shared/lazy/category-select/category-select.module';
import {SubCategorySelectModule} from '../../shared/lazy/sub-category-select/sub-category-select.module';
import {BrandSelectModule} from 'src/app/shared/lazy/brand-select/brand-select.module';
import {QuillEditorComponent} from "ngx-quill";
import {MatSelectFilterModule} from "mat-select-filter";
import {LowStockComponent} from './low-stock/low-stock.component';
import {HtmlEditorModule} from "../../shared/components/html-editor/html-editor.module";
import {BestSellerProductComponent} from './best-seller-product/best-seller-product.component';
import { BulkUploadProductComponent } from './bulk-upload-product/bulk-upload-product.component';
import { BulkApplyTagDialogComponent } from '../../shared/dialog-view/bulk-apply-tag-dialog/bulk-apply-tag-dialog.component';

@NgModule({
    declarations: [
        AllProductComponent,
        AddProductComponent,
        LowStockComponent,
        BestSellerProductComponent,
        BulkUploadProductComponent,
        BulkApplyTagDialogComponent,
    ],
    imports: [
        CommonModule,
        ProductRoutingModule,
        NgxDropzoneModule,
        FormsModule,
        NgxPaginationModule,
        MaterialModule,
        DirectivesModule,
        PipesModule,
        FlexLayoutModule,
        DigitOnlyModule,
        AuthorSelectModule,
        TranslatorSelectModule,
        BrandSelectModule,
        PublisherSelectModule,
        CategorySelectModule,
        SubCategorySelectModule,
        MatSelectFilterModule,
        QuillEditorComponent,
        HtmlEditorModule,
    ],
})
export class ProductModule { }
