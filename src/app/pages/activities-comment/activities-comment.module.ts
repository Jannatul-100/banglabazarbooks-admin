import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivitiesCommentRoutingModule } from './activities-comment-routing.module';
import { AddActivitiesCommentComponent } from './add-activities-comment/add-activities-comment.component';
import { AllActivitiesCommentComponent } from './all-activities-comment/all-activities-comment.component';
import {NgxDropzoneModule} from "ngx-dropzone";
import {FormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {MaterialModule} from "../../material/material.module";
import {DirectivesModule} from "../../shared/directives/directives.module";
import {QuillEditorComponent} from "ngx-quill";
import {FlexModule} from "@angular/flex-layout";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    AddActivitiesCommentComponent,
    AllActivitiesCommentComponent
  ],
  imports: [
    CommonModule,
    ActivitiesCommentRoutingModule,
    NgxDropzoneModule,
    FormsModule,
    NgxPaginationModule,
    MaterialModule,
    DirectivesModule,
    FlexModule,
    MatProgressSpinnerModule
  ]
})
export class ActivitiesCommentModule { }
