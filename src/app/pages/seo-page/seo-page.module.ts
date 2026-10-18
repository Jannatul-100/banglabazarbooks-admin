import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeoPageRoutingModule } from './seo-page-routing.module';
import { AddSeoPageComponent } from './seo-page/add-seo-page/add-seo-page.component';
import { AllSeoPageComponent } from './seo-page/all-seo-page/all-seo-page.component';

import {NgxDropzoneModule} from 'ngx-dropzone';
import {FormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {MaterialModule} from '../../material/material.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {TextFieldModule} from '@angular/cdk/text-field';
import {QuillEditorComponent} from 'ngx-quill';
import { AddRedirectUrlComponent } from './seo-page/add-redirect-url/add-redirect-url.component';
import { AllRedirectUrlComponent } from './seo-page/all-redirect-url/all-redirect-url.component';

@NgModule({
  declarations: [
    AddSeoPageComponent,
    AllSeoPageComponent,
    AddRedirectUrlComponent,
    AllRedirectUrlComponent
  ],
  imports: [
    CommonModule,
    SeoPageRoutingModule,
    NgxDropzoneModule,
    FormsModule,
    NgxPaginationModule,
    MaterialModule,
    DirectivesModule,
    TextFieldModule,
    QuillEditorComponent
  ]
})
export class SeoPageModule { }
