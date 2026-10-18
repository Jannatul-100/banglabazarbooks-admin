import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SnackbarNotificationComponent} from './components/ui/snackbar-notification/snackbar-notification.component';
import {ConfirmDialogComponent} from './components/ui/confirm-dialog/confirm-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {OutSideClickDirective} from './directives/out-side-click.directive';
import { ConfirmDialogWithCheckComponent } from './components/ui/confirm-dialog-with-check/confirm-dialog-with-check.component';


import { CourierSelectionDialogComponent } from './dialog-view/courier-selection-dialog/courier-selection-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { SelectedOrdersReportDialogComponent } from './dialog-view/selected-orders-report-dialog/selected-orders-report-dialog.component';


@NgModule({
  declarations: [
    SnackbarNotificationComponent,
    ConfirmDialogComponent,
    OutSideClickDirective,
    ConfirmDialogWithCheckComponent,
    CourierSelectionDialogComponent,
    SelectedOrdersReportDialogComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  exports: [
    SnackbarNotificationComponent,
    ConfirmDialogComponent,
    OutSideClickDirective,
    CourierSelectionDialogComponent,
    SelectedOrdersReportDialogComponent,
    MatIconModule,
  ],
  providers: []
})
export class SharedModule {
}
