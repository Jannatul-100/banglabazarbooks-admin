import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { AddNotificationComponent } from './add-notification/add-notification.component';
import { AllNotificationComponent } from './all-notification/all-notification.component';
import {NgxDropzoneModule} from "ngx-dropzone";
import {FormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {MaterialModule} from "../../material/material.module";
import {DirectivesModule} from "../../shared/directives/directives.module";
import {QuillEditorComponent} from "ngx-quill";
import {HtmlEditorModule} from "../../shared/components/html-editor/html-editor.module";


@NgModule({
  declarations: [
    AddNotificationComponent,
    AllNotificationComponent
  ],
    imports: [
        CommonModule,
        NotificationRoutingModule,
        NgxDropzoneModule,
        FormsModule,
        NgxPaginationModule,
        MaterialModule,
        DirectivesModule,
        QuillEditorComponent,
        HtmlEditorModule,
    ]
})
export class NotificationModule { }
