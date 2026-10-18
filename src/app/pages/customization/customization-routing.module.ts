import { AddBannerComponent } from './banner/add-banner/add-banner.component';
import { AllBannerComponent } from './banner/all-banner/all-banner.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCarouselComponent } from './carousel/add-carousel/add-carousel.component';
import { AllCarouselsComponent } from './carousel/all-carousels/all-carousels.component';
import { ShopInformationComponent } from './shop-information/shop-information.component';
import {AddPopupComponent} from "./popup/add-popup/add-popup.component";
import {AllPopupComponent} from "./popup/all-popup/all-popup.component";
import { SettingComponent } from './setting/setting.component';
import { FacebookCatalogComponent } from './facebook-catalog/facebook-catalog.component';

const routes: Routes = [
  { path: 'all-carousels', component: AllCarouselsComponent },
  { path: 'add-carousel', component: AddCarouselComponent },
  { path: 'edit-carousel/:id', component: AddCarouselComponent },
  { path: 'shop-information', component: ShopInformationComponent},
  { path: 'setting', component: SettingComponent},
  { path: 'facebook-catalog', component: FacebookCatalogComponent },
  { path: 'all-banner', component: AllBannerComponent },
  { path: 'add-banner', component: AddBannerComponent },
  { path: 'edit-banner/:id', component: AddBannerComponent },
  { path: 'all-popup', component: AllPopupComponent },
  { path: 'add-popup', component: AddPopupComponent},
  { path: 'edit-popup/:id', component: AddPopupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomizationRoutingModule {}
