import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivitiesRoutingModule } from './activities-routing.module';
import { AddActivitiesComponent } from './add-activities/add-activities.component';
import { AllActivitiesComponent } from './all-activities/all-activities.component';
import {NgxDropzoneModule} from "ngx-dropzone";
import {FormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {MaterialModule} from "../../material/material.module";
import {DirectivesModule} from "../../shared/directives/directives.module";
import {QuillEditorComponent} from "ngx-quill";
import {HtmlEditorModule} from "../../shared/components/html-editor/html-editor.module";


@NgModule({
  declarations: [
    AddActivitiesComponent,
    AllActivitiesComponent
  ],
    imports: [
        CommonModule,
        ActivitiesRoutingModule,
        NgxDropzoneModule,
        FormsModule,
        NgxPaginationModule,
        MaterialModule,
        DirectivesModule,
        QuillEditorComponent,
        HtmlEditorModule,
    ]
})
export class ActivitiesModule { }
