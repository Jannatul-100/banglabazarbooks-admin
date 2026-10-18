import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingService } from 'src/app/services/common/setting.service';
import { UiService } from 'src/app/services/core/ui.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Setting } from 'src/app/interfaces/common/setting.interface';
import { Subscription } from 'rxjs';
import { COURIER_PROVIDERS } from 'src/app/core/utils/app-data';
import { Select } from 'src/app/interfaces/core/select';

import { Clipboard } from '@angular/cdk/clipboard';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit, OnDestroy {
  dataForm?: FormGroup;
  setting?: Setting;
  isLoading = false;
  selectedSection = 'gtm';

  // Feed URLs
  readonly feedCsvUrl = `${environment.apiBaseLink}/api/facebook-catalog/datafeed.csv`;
  readonly feedXmlUrl = `${environment.apiBaseLink}/api/facebook-catalog/datafeed.xml`;

  // Courier Data
  readonly courierProviders: Select[] = COURIER_PROVIDERS;
  courierMethods: any[] = [];
  selectedIndex!: number;
  formViewMode: 'add' | 'edit' | '' = '';

  private subDataOne?: Subscription;
  private subDataTwo?: Subscription;

  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.getSetting();
  }

  private initFormGroup() {
    this.dataForm = this.fb.group({
      analytics: this.fb.group({
        tagManagerId: [null],
        facebookPixelId: [null],
        facebookPixelAccessToken: [null],
        IsManageFbPixelByTagManager: [false],
        isEnablePixelTestEvent: [false],
        facebookPixelTestEventId: [null],
        tiktokPixelId: [null],
        tiktokAccessToken: [null],
        tiktokTestEventCode: [null],
        isPurchaseEventOnConfirm: [false],
      }),
      // New fields for Courier Form (used when editing a specific method)
      providerName: [null],
      apiKey: [null],
      secretKey: [null],
      username: [null],
      password: [null],
      status: [null],
      storeId: [null],
      specialInstruction: [null],
      fraudCheck: this.fb.group({
        apiKey: [null],
        apiType: [null],
      }),
      isEnableFacebookCatalog: [false],
    });
  }

  /**
   * UI Logics
   * onAddNewCourier()
   * toggleCourierStatus()
   * onSelectCourier()
   * isDisabledOpt()
   */
  onAddNewCourier() {
    this.formViewMode = 'add';
    const missingTypes = this.courierProviders.filter((f) =>
      !this.courierMethods.some(
        (m) => m.providerName === f.value
      )
    );
    this.dataForm?.patchValue({
      providerName: missingTypes.length ? missingTypes[0].value : this.courierProviders[0].value,
      apiKey: null,
      secretKey: null,
      username: null,
      password: null,
      status: null,
      storeId: null,
      specialInstruction: null,
    });
  }

  toggleCourierStatus(index: number, event: Event): void {
    event.stopPropagation();
    this.courierMethods.forEach((method, i) => {
      method.status = i === index ? 'active' : 'inactive';
    });
    this.onSubmit(); // Auto save
  }

  onSelectCourier(index: number) {
    this.formViewMode = 'edit';
    this.selectedIndex = index;
    const selected = this.courierMethods[index];
    this.dataForm?.patchValue({
      providerName: selected.providerName,
      apiKey: selected.apiKey,
      secretKey: selected.secretKey,
      username: selected.username,
      password: selected.password,
      status: selected.status,
      storeId: selected.storeId,
      specialInstruction: selected.specialInstruction,
    });
  }

  isDisabledOpt(value: string): boolean {
    return this.courierMethods.some(m => m.providerName === value);
  }

  private getSetting() {
    this.subDataOne = this.settingService.getSetting().subscribe({
      next: (res) => {
        if (res.data) {
          this.setting = res.data;
          this.dataForm?.patchValue(this.setting);
          if (this.setting.facebookCatalog) {
            this.dataForm?.patchValue({
              isEnableFacebookCatalog: this.setting.facebookCatalog.isEnableFacebookCatalog ?? false,
            });
          }
          if (this.setting.courierMethods) {
            this.courierMethods = this.setting.courierMethods;
            const activeIndex = this.courierMethods.findIndex(m => m.status === 'active');
            if (activeIndex !== -1) {
              this.onSelectCourier(activeIndex);
            } else if (this.courierMethods.length) {
              this.onSelectCourier(0);
            }
          }
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onCopyUrl(url: string, label = 'Feed URL'): void {
    if (!url) return;
    this.clipboard.copy(url);
    this.uiService.success(`${label} copied to clipboard!`);
  }

  onSubmit() {
    this.isLoading = true;
    this.spinner.show();

    // Prepare courier data before saving
    if (this.formViewMode === 'add') {
      const newMethod = {
        providerName: this.dataForm?.value.providerName,
        apiKey: this.dataForm?.value.apiKey,
        secretKey: this.dataForm?.value.secretKey,
        username: this.dataForm?.value.username,
        password: this.dataForm?.value.password,
        storeId: this.dataForm?.value.storeId,
        specialInstruction: this.dataForm?.value.specialInstruction,
        status: !this.courierMethods.length ? 'active' : 'inactive'
      };
      this.courierMethods.push(newMethod);
      this.formViewMode = 'edit';
      this.selectedIndex = this.courierMethods.length - 1;
    } else if (this.formViewMode === 'edit') {
      const updatedMethod = {
        providerName: this.dataForm?.value.providerName,
        apiKey: this.dataForm?.value.apiKey,
        secretKey: this.dataForm?.value.secretKey,
        username: this.dataForm?.value.username,
        password: this.dataForm?.value.password,
        storeId: this.dataForm?.value.storeId,
        specialInstruction: this.dataForm?.value.specialInstruction,
        status: this.courierMethods[this.selectedIndex]?.status || 'inactive'
      };
      this.courierMethods[this.selectedIndex] = updatedMethod;
    }

    const finalData = {
      analytics: this.dataForm?.value.analytics,
      fraudCheck: this.dataForm?.value.fraudCheck,
      courierMethods: this.courierMethods,
      facebookCatalog: {
        isEnableFacebookCatalog: this.dataForm?.value.isEnableFacebookCatalog,
      },
    };

    this.subDataTwo = this.settingService.updateSetting(finalData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.spinner.hide();
        if (res.success) {
          this.uiService.success(res.message);
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.spinner.hide();
        console.log(error);
      }
    });
  }

  ngOnDestroy() {
    if (this.subDataOne) this.subDataOne.unsubscribe();
    if (this.subDataTwo) this.subDataTwo.unsubscribe();
  }
}
