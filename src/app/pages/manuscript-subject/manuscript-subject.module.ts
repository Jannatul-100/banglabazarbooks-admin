import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManuscriptSubjectRoutingModule } from './manuscript-subject-routing.module';
import { AddManuscriptComponent } from './add-manuscript/add-manuscript.component';
import { AllManuscriptComponent } from './all-manuscript/all-manuscript.component';
import {NgxDropzoneModule} from "ngx-dropzone";
import {FormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {MaterialModule} from "../../material/material.module";
import {DirectivesModule} from "../../shared/directives/directives.module";
import {NgxSpinnerModule} from "ngx-spinner";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [

    AddManuscriptComponent,
       AllManuscriptComponent
  ],
  imports: [
    CommonModule,
    ManuscriptSubjectRoutingModule,
    NgxDropzoneModule,
    FormsModule,
    NgxPaginationModule,
    MaterialModule,
    DirectivesModule,
    NgxSpinnerModule,
    MatIconModule
  ]
})
export class ManuscriptSubjectModule { }
