import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SalesRoutingModule} from './sales-routing.module';
import {ChartsModule} from 'ng2-charts';
import {AllOrdersComponent} from './all-orders/all-orders.component';
import {AddOrderComponent} from './add-order/add-order.component';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../../material/material.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxSpinnerModule} from 'ngx-spinner';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {ProductListModule} from '../../shared/dialog-view/product-list/product-list.module';
import {UpdateOrderStatusComponent} from './update-order-status/update-order-status.component';
import {OrderDetailsComponent} from './order-details/order-details.component';
import {OrderTimelineModule} from '../../shared/lazy/order-timeline/order-timeline.module';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { ProductVariationDialogComponent } from './product-variation-dialog/product-variation-dialog.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ShippingChargeComponent } from './shipping-charge/shipping-charge.component';
import {GeneralDropdownModule} from "../../shared/general-dropdown/general-dropdown.module";


import { OrderPrintComponent } from './order-print/order-print.component';
import { MultipleStickerComponent } from './multiple-sticker/multiple-sticker.component';
import { BkashRefundComponent } from './bkash-refund/bkash-refund.component';
import {WebcamModule} from 'ngx-webcam';
import { PackingStationComponent } from './packing-station/packing-station.component';
import { ModeratorActivityComponent } from './moderator-activity/moderator-activity.component';

@NgModule({
  declarations: [
    AllOrdersComponent,
    AddOrderComponent,
    UpdateOrderStatusComponent,
    OrderDetailsComponent,
    OrderPrintComponent,
    ProductVariationDialogComponent,
    TransactionsComponent,
    ShippingChargeComponent,
    MultipleStickerComponent,
    BkashRefundComponent,
    PackingStationComponent,
    ModeratorActivityComponent
  ],
    imports: [
        CommonModule,
        SalesRoutingModule,
        FormsModule,
        MaterialModule,
        NgxPaginationModule,
        PipesModule,
        FlexLayoutModule,
        DirectivesModule,
        DigitOnlyModule,
        ProductListModule,
        OrderTimelineModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        GeneralDropdownModule,
        WebcamModule,
        NgxSpinnerModule,
        ChartsModule,
    ]
})
export class SalesModule { }
