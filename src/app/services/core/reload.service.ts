
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReloadService {
  private refreshUser = new Subject<void>();
  private refreshData = new Subject<void>();
  private refreshBrand = new Subject<void>();
  private refreshRedirectUrl = new Subject<void>();
  private refreshNotification = new Subject<void>();
  private refreshPopup = new Subject<void>();
  private refreshProduct = new Subject<void>();
  private refreshCategory = new Subject<void>();
  private refreshSubCategory = new Subject<void>();
  private refreshUnit = new Subject<void>();
  private refreshCustomer = new Subject<void>();
  private refreshVendor = new Subject<void>();
  private refreshSideNav = new Subject<void>();
  private refreshSelectedData = new Subject();
  get refreshPopup$() {
    return this.refreshPopup;
  }

  /**
   * REFRESH GLOBAL
   */
  get refreshBrand$() {
    return this.refreshBrand;
  }
  needRefreshBrand$() {
    this.refreshBrand.next();
  }

  get refreshRedirectUrl$() {
    return this.refreshRedirectUrl;
  }
  needRefreshRedirectUrl$() {
    this.refreshRedirectUrl.next();
  }

  get refreshNotification$() {
    return this.refreshBrand;
  }
  needRefreshNotification$() {
    this.refreshBrand.next();
  }
  get refreshSideNav$() {
    return this.refreshSideNav;
  }

  needRefreshSideNav$() {
    this.refreshSideNav.next();
  }
  get refreshProduct$() {
    return this.refreshProduct;
  }

  needRefreshProduct$() {
    this.refreshProduct.next();
  }

  /**
   * REFRESH Select DATA
   */
  get refreshSelectData$() {
    return this.refreshSelectedData;
  }

  needRefreshSelectData$(data: any) {
    this.refreshSelectedData.next(data);
  }


  get refreshCategory$() {
    return this.refreshCategory;
  }

  needRefreshCategory$() {
    this.refreshCategory.next();
  }

  get refreshSubCategory$() {
    return this.refreshSubCategory;
  }

  needRefreshSubCategory$() {
    this.refreshSubCategory.next();
  }

  get refreshUnit$() {
    return this.refreshUnit;
  }

  needRefreshUnit$() {
    this.refreshUnit.next();
  }

  get refreshCustomer$() {
    return this.refreshCustomer;
  }

  needRefreshCustomer$() {
    this.refreshCustomer.next();
  }

  get refreshVendor$() {
    return this.refreshVendor;
  }

  needRefreshVendor$() {
    this.refreshVendor.next();
  }

  /**
   * REFRESH GLOBAL DATA
   */
  get refreshData$() {
    return this.refreshData;
  }
  needRefreshData$() {
    this.refreshData.next();
  }

  /**
   * REFRESH USEr DATA
   */

  get refreshUser$() {
    return this.refreshUser;
  }
  needRefreshUser$() {
    this.refreshUser.next();
  }
}
