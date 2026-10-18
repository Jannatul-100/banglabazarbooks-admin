import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomizationRoutingModule } from './customization-routing.module';
import { AddCarouselComponent } from './carousel/add-carousel/add-carousel.component';
import { AllCarouselsComponent } from './carousel/all-carousels/all-carousels.component';
import { AddBannerComponent } from './banner/add-banner/add-banner.component';
import { AllBannerComponent } from './banner/all-banner/all-banner.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/material/material.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ShopInformationComponent } from './shop-information/shop-information.component';
import {AddPopupComponent} from "./popup/add-popup/add-popup.component";
import {AllPopupComponent} from "./popup/all-popup/all-popup.component";
import {PipesModule} from "../../shared/pipes/pipes.module";
import { SettingComponent } from './setting/setting.component';
import { FacebookCatalogComponent } from './facebook-catalog/facebook-catalog.component';

@NgModule({
  declarations: [
    AddCarouselComponent,
    AllCarouselsComponent,
    AddBannerComponent,
    AllBannerComponent,
    ShopInformationComponent,
    AddPopupComponent,
    AllPopupComponent,
    SettingComponent,
    FacebookCatalogComponent,
  ],
    imports: [
        CommonModule,
        CustomizationRoutingModule,
        NgxDropzoneModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        MaterialModule,
        DirectivesModule,
        NgxSpinnerModule,
        MatIconModule,
        PipesModule
    ]
})
export class CustomizationModule {}
