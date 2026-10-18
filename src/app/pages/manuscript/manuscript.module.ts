import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManuscriptRoutingModule } from './manuscript-routing.module';
import { AllManuscriptComponent } from './all-manuscript/all-manuscript.component';
import { AddManuscriptComponent } from './add-manuscript/add-manuscript.component';
import { FormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/material/material.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { ManuscriptComponent } from './manuscript/manuscript.component';


@NgModule({
  declarations: [
    AllManuscriptComponent,
    AddManuscriptComponent,
    ManuscriptComponent
  ],
  imports: [
    CommonModule,
    ManuscriptRoutingModule,
    NgxDropzoneModule,
    FormsModule,
    NgxPaginationModule,
    MaterialModule,
    DirectivesModule,
  ]
})
export class ManuscriptModule { }
