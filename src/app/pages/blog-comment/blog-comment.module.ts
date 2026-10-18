import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogCommentRoutingModule } from './blog-comment-routing.module';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { AllCommentComponent } from './all-comment/all-comment.component';
import {NgxDropzoneModule} from "ngx-dropzone";
import {FormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {MaterialModule} from "../../material/material.module";
import {DirectivesModule} from "../../shared/directives/directives.module";
import {FlexModule} from "@angular/flex-layout";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    AddCommentComponent,
    AllCommentComponent
  ],
  imports: [
    CommonModule,
    BlogCommentRoutingModule,
    NgxDropzoneModule,
    FormsModule,
    NgxPaginationModule,
    MaterialModule,
    DirectivesModule,
    FlexModule,
    MatProgressSpinnerModule
  ]
})
export class BlogCommentModule { }
