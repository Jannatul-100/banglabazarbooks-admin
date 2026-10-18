import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PraptisthanaRoutingModule } from './praptisthana-routing.module';
import {AddPraptisthanaComponent} from "./add-praptisthana/add-praptisthana.component";
import {AllPraptisthanaComponent} from "./all-praptisthana/all-praptisthana.component";
import {NgxDropzoneModule} from "ngx-dropzone";
import {FormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {MaterialModule} from "../../material/material.module";
import {DirectivesModule} from "../../shared/directives/directives.module";
import {NgxSpinnerModule} from "ngx-spinner";
import {MatIconModule} from "@angular/material/icon";
import {PipesModule} from "../../shared/pipes/pipes.module";


@NgModule({
  declarations: [
    AddPraptisthanaComponent,
    AllPraptisthanaComponent
  ],
  imports: [
    CommonModule,
    PraptisthanaRoutingModule,
    NgxDropzoneModule,
    FormsModule,
    NgxPaginationModule,
    MaterialModule,
    DirectivesModule,
    NgxSpinnerModule,
    MatIconModule,
    PipesModule
  ]
})
export class PraptisthanaModule { }
