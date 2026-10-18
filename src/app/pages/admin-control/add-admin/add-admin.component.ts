import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {ADMIN_PAGES, ADMIN_PERMISSIONS, ADMIN_ROLES, GENDERS} from 'src/app/core/utils/app-data';
import {Admin} from 'src/app/interfaces/admin/admin';
import {Select} from 'src/app/interfaces/core/select';
import {AdminDataService} from 'src/app/services/admin/admin-data.service';
import {AdminService} from 'src/app/services/admin/admin.service';
import {UiService} from 'src/app/services/core/ui.service';
import {PublisherService} from 'src/app/services/common/publisher.service';
import {Publisher} from 'src/app/interfaces/common/publisher.interface';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit, OnDestroy {

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  id?: string;
  user?: Admin;
  publishers: Publisher[] = [];

  // Static Data
  roles: Select[] = ADMIN_ROLES;
  permissions: Select[] = ADMIN_PERMISSIONS;
  adminPages: Select[] = ADMIN_PAGES;
  genders: Select[] = GENDERS;
  hasAccess: Select[] = [
    {value: true, viewValue: 'Yes'},
    {value: false, viewValue: 'No'},
  ];
  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private adminDataService: AdminDataService,
    private adminService: AdminService,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private publisherService: PublisherService,
  ) {
  }

  ngOnInit(): void {

    // Init Data Form
    this.initDataForm();
    this.getAllPublishers();

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getAdminById();
      }
    });
  }

  /**
   * FORM METHODS
   * initDataForm()
   * setFormValue()
   * onSubmit()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      email: [null, Validators.email],
      username: [null, Validators.required],
      phoneNo: [null, Validators.required],
      gender: [null, Validators.required],
      role: [null, Validators.required],
      permissions: [null, Validators.required],
      hasAccess: [null, Validators.required],
      publisher: [null],
      accessPages: [[]],
      password: [null],
      newPassword: [null]
    });
  }

  getAllPublishers() {
    this.publisherService
      .getAllPublisher({ filter: null, pagination: null, sort: { name: 1 } })
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.publishers = res.data || [];
            if (this.user?.publisher) {
              this.dataForm.patchValue({ publisher: this.user.publisher });
            }
          }
        },
        error: (err) => console.error(err),
      });
  }

  comparePublisher(p1: any, p2: any): boolean {
    if (!p1 || !p2) return false;
    const id1 = typeof p1 === 'string' ? p1 : (p1._id || p1.id);
    const id2 = typeof p2 === 'string' ? p2 : (p2._id || p2.id);
    return id1 && id2 ? id1.toString() === id2.toString() : false;
  }

  selectAllPages() {
    const all = this.adminPages.map((p) => p.value);
    this.dataForm.get('accessPages').setValue(all);
  }

  deselectAllPages() {
    this.dataForm.get('accessPages').setValue([]);
  }

  onRoleChange(role: string) {
    if (role === 'publisher') {
      this.dataForm.get('accessPages').setValue([]);
    } else if (role === 'salesman') {
      this.dataForm.get('accessPages').setValue(['dashboard', 'sales', 'product', 'profile']);
    } else if (role === 'editor') {
      this.dataForm.get('accessPages').setValue(['dashboard', 'product', 'catalog', 'blog', 'comment', 'gallery', 'profile']);
    } else if (role === 'super_admin') {
      this.selectAllPages();
    } else if (role === 'admin') {
      this.dataForm.get('accessPages').setValue(
        this.adminPages.map((p) => p.value).filter((v) => v !== 'admin-control')
      );
    }
  }

  private setFormValue() {
    this.dataForm.patchValue({ ...this.user, password: null });
    if (this.user?.publisher) {
      this.dataForm.get('publisher').setValue(this.user.publisher);
    }
    if (this.user?.accessPages) {
      this.dataForm.get('accessPages').setValue(this.user.accessPages);
    }
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }

    if (this.id) {
      this.updateAdminById();
    } else {
      this.adminRegistration();
    }
  }


  /**
   * HTTP REQ HANDLE
   * getAdminById
   * adminRegistration
   * updateAdminById
   */

  private getAdminById() {
    this.spinnerService.show();
    const select = 'name email username phoneNo gender role permissions hasAccess publisher accessPages';
    this.subDataTwo = this.adminDataService.getAdminById(this.id, select)
      .subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.user = res.data;
          this.setFormValue();
        }
      }, error => {
        this.spinnerService.hide();
        console.log(error);
      });
  }

  private adminRegistration() {
    this.spinnerService.show();
    const finalData = {
      ...this.dataForm.value,
      ...{username: this.generateUsername}
    };

    this.subDataOne = this.adminService.adminRegistration(finalData)
      .subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.uiService.success(res.message);
          this.formElement.resetForm();
        } else {
          this.uiService.warn(res.message);
        }
      }, error => {
        this.spinnerService.hide();
        console.log(error);
      });
  }

  private updateAdminById() {
    this.spinnerService.show();
    // Delete Bad Field
    const mData = this.dataForm.value;
    delete mData.password;

    const adminId = this.user?._id || this.id;
    this.subDataThree = this.adminDataService.updateAdminById(adminId, mData)
      .subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.uiService.success(res.message);
        } else {
          this.uiService.warn(res.message);
        }
      }, error => {
        this.spinnerService.hide();
        console.log(error);
      });
  }

  /**
   * GENERATE USER NAME
   */
  public get generateUsername(): string {
    if (this.dataForm && this.dataForm.value.username) {
      // const rs = this.dataForm.value.username.replace(/[^a-zA-Z ]/g, '');
      const rs = this.dataForm.value.username.replace(/[^A-Za-z0-9]/g, '');
      return rs.trim().toLowerCase();
    } else {
      return '';
    }
  }


  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }
  }


}
