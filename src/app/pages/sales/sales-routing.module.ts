import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllOrdersComponent} from './all-orders/all-orders.component';
import {AddOrderComponent} from './add-order/add-order.component';
import {OrderDetailsComponent} from './order-details/order-details.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ShippingChargeComponent } from './shipping-charge/shipping-charge.component';

import { OrderPrintComponent } from './order-print/order-print.component';
import { MultipleStickerComponent } from './multiple-sticker/multiple-sticker.component';
import { BkashRefundComponent } from './bkash-refund/bkash-refund.component';
import { PackingStationComponent } from './packing-station/packing-station.component';
import { ModeratorActivityComponent } from './moderator-activity/moderator-activity.component';

const routes: Routes = [
  // {path: '', redirectTo: 'all-orders'},
  {path: 'all-orders', component: AllOrdersComponent},
  {path: 'draft-orders', component: AllOrdersComponent},
  {path: 'pre-orders', component: AllOrdersComponent},
  {path: 'add-order', component: AddOrderComponent},
  {path: 'transaction', component: TransactionsComponent},
  {path: 'edit-order/:id', component: AddOrderComponent},
  {path: 'order-details/:id', component: OrderDetailsComponent},
  {path: 'order-print', component: OrderPrintComponent},
  {path: 'multiple-sticker', component: MultipleStickerComponent},
  {path: 'shipping-charge', component: ShippingChargeComponent},
  {path: 'bkash-refund', component: BkashRefundComponent},
  {path: 'packing-station', component: PackingStationComponent},
  {path: 'moderator-activity', component: ModeratorActivityComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
