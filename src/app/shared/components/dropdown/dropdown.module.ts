import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown.component';
import {OutSideClickModule} from "../../directives/out-side-click/out-side-click.module";
import {MaterialModule} from "../../../material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    DropdownComponent
  ],
    imports: [
        CommonModule,
        OutSideClickModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        OutSideClickModule
    ],
  exports:[
    DropdownComponent
  ]
})
export class DropdownModule { }
