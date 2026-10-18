import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {MatIconModule} from '@angular/material/icon';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatRadioModule} from '@angular/material/radio';
import {MatNativeDateModule} from '@angular/material/core';
import {DonutComponent} from './donut/donut.component';
import {GraphComponent} from './graph/graph.component';
import {MatButtonModule} from '@angular/material/button';
import {SaleConfirmModule} from '../../shared/dialog-view/sale-confirm/sale-confirm.module';
import {NgApexchartsModule} from "ng-apexcharts";
import {UsersComponent} from './users/users.component';
import {ChartsModule} from "ng2-charts";
import {BarChatComponent} from './bar-chat/bar-chat.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DonutComponent,
    GraphComponent,
    UsersComponent,
    BarChatComponent,

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatIconModule,
    PipesModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    MatButtonModule,
    SaleConfirmModule,
    NgApexchartsModule,
    ChartsModule,
  ]
})
export class DashboardModule { }
