import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YoutubeVideoRoutingModule } from './youtube-video-routing.module';
import { AddVideoComponent } from './add-video/add-video.component';
import { AllVideoComponent } from './all-video/all-video.component';
import {NgxDropzoneModule} from "ngx-dropzone";
import {FormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {MaterialModule} from "../../material/material.module";
import {DirectivesModule} from "../../shared/directives/directives.module";
import {NgxSpinnerModule} from "ngx-spinner";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [
    AddVideoComponent,
    AllVideoComponent
  ],
  imports: [
    CommonModule,
    YoutubeVideoRoutingModule,
    NgxDropzoneModule,
    FormsModule,
    NgxPaginationModule,
    MaterialModule,
    DirectivesModule,
    NgxSpinnerModule,
    MatIconModule
  ]
})
export class YoutubeVideoModule { }
