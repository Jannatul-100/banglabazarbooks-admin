import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlEditorComponent } from './html-editor.component';
import {DropdownModule} from "../dropdown/dropdown.module";
import {GalleryModule} from "../../../pages/gallery/gallery.module";
import {MaterialModule} from "../../../material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    HtmlEditorComponent
  ],
  imports: [
    CommonModule,
    DropdownModule,
    GalleryModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[
    HtmlEditorComponent
  ]
})
export class HtmlEditorModule { }
