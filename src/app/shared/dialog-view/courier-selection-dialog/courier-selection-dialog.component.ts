import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { SettingService } from "../../../services/common/setting.service";
import { Setting } from '../../../interfaces/common/setting.interface';

@Component({
  selector: 'app-courier-selection-dialog',
  templateUrl: './courier-selection-dialog.component.html',
  styleUrls: ['./courier-selection-dialog.component.scss'],
})
export class CourierSelectionDialogComponent implements OnInit, OnDestroy {

  selectedCourier: any | null = null;
  courierMethods: any[] = [];
  setting: Setting;

  private readonly settingService = inject(SettingService);
  private subscriptions: Subscription[] = [];

  constructor(public dialogRef: MatDialogRef<CourierSelectionDialogComponent>) {}

  ngOnInit(): void {
    this.getSetting();
  }

  private getSetting() {
    const subscription = this.settingService.getSetting()
      .subscribe({
        next: res => {
          if (res.data) {
            this.setting = res.data;
            if (this.setting.courierMethods) {
              this.courierMethods = this.setting.courierMethods;
              // 👉 Active courier খুঁজে selectedCourier set করো
              const activeCourier = this.courierMethods.find(courier => courier.status === 'active');
              if (activeCourier) {
                this.selectedCourier = activeCourier;
              } else if (this.courierMethods.length > 0) {
                this.selectedCourier = this.courierMethods[0];
              }
            }
          }
        },
        error: err => {
          console.log(err)
        }
      });

    this.subscriptions.push(subscription);
  }


  selectCourier(courier: any) {
    this.selectedCourier = courier;
  }

  confirm() {
    if (this.selectedCourier) {
      this.courierMethods.forEach(courier => {
        courier.status = (courier === this.selectedCourier) ? 'active' : 'inactive';
      });

      this.updateSetting();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  private updateSetting() {
    const data = { 
      ...this.setting,
      courierMethods: this.courierMethods 
    };

    const subscription = this.settingService.updateSetting(data)
      .subscribe({
        next: res => {
          if (res.success) {
            this.dialogRef.close(this.selectedCourier);
          } else {
            console.log('Failed to update courier status');
          }
        },
        error: err => {
          console.log(err);
        }
      });

    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }

}
