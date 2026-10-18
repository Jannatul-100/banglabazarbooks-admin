import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NumberMinDigitPipe} from './number-min-digit.pipe';
import {SecToTimePipe} from './sec-to-time.pipe';
import { OrderStatusPipe } from './order-status.pipe';
import { PricePipe } from './price.pipe';
import { CheckNullPipe } from './check-null.pipe';
import { ProductDiscountViewPipe } from './product-discount-view.pipe';
import { SlugToNormalPipe } from './slug-to-normal.pipe';
import { SafeHtmlCustomPipe } from './safe-html.pipe';
import {SafeUrlPipe} from "./safe-url.pipe";
import {StringToSlugPipe} from "./string-to-slug.pipe";


@NgModule({
  declarations: [
    NumberMinDigitPipe,
    SecToTimePipe,
    OrderStatusPipe,
    PricePipe,
    CheckNullPipe,
    ProductDiscountViewPipe,
    SlugToNormalPipe,
    SafeHtmlCustomPipe,
    SafeUrlPipe,
    StringToSlugPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NumberMinDigitPipe,
    SecToTimePipe,
    OrderStatusPipe,
    PricePipe,
    CheckNullPipe,
    ProductDiscountViewPipe,
    SlugToNormalPipe,
    SafeHtmlCustomPipe,
    SafeUrlPipe,
    StringToSlugPipe
  ]
})
export class PipesModule {
}
