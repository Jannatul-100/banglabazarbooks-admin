import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { AddLandingPageComponent } from './add-landing-page/add-landing-page.component';
import { AllLandingPageComponent } from './all-landing-page/all-landing-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { FlexModule } from '@angular/flex-layout';
import { HtmlEditorModule } from '../../shared/components/html-editor/html-editor.module';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { StringToSlugPipe } from '../../shared/pipes/string-to-slug.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [AddLandingPageComponent, AllLandingPageComponent],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexModule,
    HtmlEditorModule,
    DirectivesModule,
    NgxPaginationModule,
    DigitOnlyModule,
    NgxSpinnerModule,
  ],
  providers: [StringToSlugPipe],
})
export class LandingPageModule {}
