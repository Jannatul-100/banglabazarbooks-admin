import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CatalogRoutingModule} from './catalog-routing.module';
import {AddCategoryComponent} from './category/add-category/add-category.component';
import {AllCategoryComponent} from './category/all-category/all-category.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {NgxPaginationModule} from 'ngx-pagination';
import {MaterialModule} from 'src/app/material/material.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {AllSubCategoryComponent} from './sub-category/all-sub-category/all-sub-category.component';
import {AddSubCategoryComponent} from './sub-category/add-sub-category/add-sub-category.component';
import {AllPublisherComponent} from './publisher/all-publisher/all-publisher.component';
import {AddPublisherComponent} from './publisher/add-publisher/add-publisher.component';
import {AllAuthorComponent} from './author/all-author/all-author.component';
import {AddAuthorComponent} from './author/add-author/add-author.component';
import {AllTranslatorComponent} from './translator/all-translator/all-translator.component';
import {AddTranslatorComponent} from './translator/add-translator/add-translator.component';
import {AllTagComponent} from './tag/all-tag/all-tag.component';
import {AddTagComponent} from './tag/add-tag/add-tag.component';
import {ManageTagBooksDialogComponent} from './tag/manage-tag-books-dialog/manage-tag-books-dialog.component';
import {AddBrandComponent} from './brand/add-brand/add-brand.component';
import {AllBrandComponent} from './brand/all-brand/all-brand.component';
import {QuillEditorComponent} from "ngx-quill";
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule({
  declarations: [
    AddCategoryComponent,
    AllCategoryComponent,
    AllSubCategoryComponent,
    AddSubCategoryComponent,
    AllPublisherComponent,
    AddPublisherComponent,
    AllAuthorComponent,
    AddAuthorComponent,
    AllTranslatorComponent,
    AddTranslatorComponent,
    AllTagComponent,
    AddTagComponent,
    ManageTagBooksDialogComponent,
    AddBrandComponent,
    AllBrandComponent
  ],
    imports: [
        CommonModule,
        CatalogRoutingModule,
        NgxDropzoneModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        MaterialModule,
        DirectivesModule,
        QuillEditorComponent,
        NgxSpinnerModule,
    ]
})
export class CatalogModule { }
