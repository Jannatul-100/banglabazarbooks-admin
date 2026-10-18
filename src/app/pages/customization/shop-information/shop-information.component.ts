import {CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';import { ShopInformation } from 'src/app/interfaces/common/shop-information.interface';
import { Select } from 'src/app/interfaces/core/select';
import { defaultUploadImage } from 'src/app/core/utils/app-data';
import { Gallery } from 'src/app/interfaces/gallery/gallery.interface';
import { UiService } from 'src/app/services/core/ui.service';
import { AllImagesDialogComponent } from '../../gallery/images/all-images-dialog/all-images-dialog.component';
import { ShopInformationService } from 'src/app/services/common/shop-information.service';
import {AllFileDialogComponent} from "../../gallery/file/all-file-dialog/all-file-dialog.component";
@Component({
  selector: 'app-shop-information',
  templateUrl: './shop-information.component.html',
  styleUrls: ['./shop-information.component.scss'],
})
export class ShopInformationComponent implements OnInit, OnDestroy {

  // // Form Template Ref
  // @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  addressesDataArray?: FormArray;
  emailsDataArray?: FormArray;
  phonesDataArray?: FormArray;
  downloadsUrlsArray?: FormArray;
  socialLinksArray?: FormArray;
  categoryPdfFile: any;

  shopInformation: ShopInformation;
  isLoading = false;

  // Store Data from param
  id?: string;

  // Image Picker
  pickedImage = defaultUploadImage;
  pickedImage1 = defaultUploadImage;
  pickedImage2 = defaultUploadImage;

  // Dummy Data
  downloadTypes: Select[] = [
    {value: 0, viewValue: 'Play Store'},
    {value: 1, viewValue: 'App Store'}
  ];

  socialTypes: Select[] = [
    {value: 0, viewValue: 'Facebook'},
    {value: 1, viewValue: 'Instagram'},
    {value: 2, viewValue: 'Twitter'},
    {value: 3, viewValue: 'Telegram'},
    {value: 4, viewValue: 'Whatsapp'},
    {value: 5, viewValue: 'YouTube'},
    {value: 6, viewValue: 'LinkedIn'}
  ];

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    public router: Router,
    private shopInformationService: ShopInformationService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {

    // INIT FORM
    this.initFormGroup();

    // GET DATA
    this.getShopInformation();

  }


  /**
   * FORMS METHODS
   * initDataForm()
   * setFormValue()
   * onSubmit()
   */
  private initFormGroup() {

    this.dataForm = this.fb.group({
      siteName: [null, Validators.required],
      shortDescription: [null],
      siteLogo: [null],
      navLogo: [null],
      footerLogo: [null],
      redirectUrl: [null],
      othersLogo: [null],
      categoryPdfFile: [null],
      addresses: this.fb.array([]),
      emails: this.fb.array([]),
      phones: this.fb.array([]),
      downloadUrls: this.fb.array([]),
      socialLinks: this.fb.array([]),
    });

    this.addressesDataArray = this.dataForm.get('addresses') as FormArray;
    this.emailsDataArray = this.dataForm.get('emails') as FormArray;
    this.phonesDataArray = this.dataForm.get('phones') as FormArray;
    this.downloadsUrlsArray = this.dataForm.get('downloadUrls') as FormArray;
    this.socialLinksArray = this.dataForm.get('socialLinks') as FormArray;

  }
  private setFormData() {
    this.dataForm.patchValue(this.shopInformation);
  }
  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (this.shopInformation) {
      const finalData = {...this.dataForm.value};
      this.updateShopInformationById(finalData);
    } else {
      this.addShopInformation(this.dataForm.value);
    }

  }

  /**
   * FORM ARRAY BUILDER
   */
  onAddNewShopObject(formControl: string) {
    const f = this.fb.group({
      type: [null],
      value: [null, Validators.required]
    });
    (this.dataForm?.get(formControl) as FormArray).push(f);
  }

  /**
   * REMOVE FORM BUILDER OBJECT
   */
  removeFormArrayField(formControl: string, index: number) {
    let formDataArray: FormArray;
    switch (formControl) {
      case 'addresses': {
        formDataArray = this.addressesDataArray;
        break;
      }
      case 'emails': {
        formDataArray = this.emailsDataArray;
        break;
      }
      case 'phones': {
        formDataArray = this.phonesDataArray;
        break;
      }
      case 'downloadUrls': {
        formDataArray = this.downloadsUrlsArray;
        break;
      }
      case 'socialLinks': {
        formDataArray = this.socialLinksArray;
        break;
      }
      default: {
        formDataArray = null;
        break;
      }
    }
    formDataArray?.removeAt(index);
  }


  /**
   * SET DATA
   */
  private setData() {
    this.shopInformation.addresses.map(m => {
      const f = this.fb.group({
        type: [m.type],
        value: [m.value, Validators.required],
      });
      (this.dataForm?.get('addresses') as FormArray).push(f);
    });

    if (this.shopInformation.categoryPdfFile && this.shopInformation.categoryPdfFile.length) {
      this.categoryPdfFile = this.shopInformation.categoryPdfFile;
    }

    this.shopInformation.emails.map(m => {
      const f = this.fb.group({
        type: [m.type],
        value: [m.value, Validators.required],
      });
      (this.dataForm?.get('emails') as FormArray).push(f);
    });

    this.shopInformation.phones.map(m => {
      const f = this.fb.group({
        type: [m.type],
        value: [m.value, Validators.required],
      });
      (this.dataForm?.get('phones') as FormArray).push(f);
    });

    this.shopInformation.downloadUrls.map(m => {
      const f = this.fb.group({
        type: [m.type],
        value: [m.value, Validators.required],
      });
      (this.dataForm?.get('downloadUrls') as FormArray).push(f);
    });

    this.shopInformation.socialLinks.map(m => {
      const f = this.fb.group({
        type: [m.type],
        value: [m.value, Validators.required],
      });
      (this.dataForm?.get('socialLinks') as FormArray).push(f);
    });

    if (this.shopInformation.siteLogo) {
      this.pickedImage = this.shopInformation.siteLogo;
    }
    this.dataForm.patchValue(this.shopInformation);
  }




  /**
   * HTTP REQ HANDLE
   *addShopInformation()
   * getShopInformation
   * updateShopInformationById
   */
  private addShopInformation(data: any) {
    this.spinner.show();
    this.subDataOne = this.shopInformationService.addShopInformation(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        console.log(err);
      });
  }
  private getShopInformation() {
    this.spinner.show();
    this.subDataTwo = this.shopInformationService.getShopInformation()
      .subscribe(res => {
        this.shopInformation = res.data;
        if (this.shopInformation) {
          this.setData();
        }
        this.spinner.hide();

      }, err => {
        this.spinner.hide();
        console.log(err);
      });
  }

  private updateShopInformationById(data: ShopInformation) {
    this.spinner.show();
    this.subDataThree = this.shopInformationService.updateShopInformationById(this.shopInformation._id, data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        console.log(err);
      });
  }

  /**
   * COMPONENT DIALOG
   * openGalleryDialog
   */

  public openGalleryDialog() {
    const dialogRef = this.dialog.open(AllImagesDialogComponent, {
      data: {type: 'single', count: 1},
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {
          const image: Gallery = dialogResult.data[0] as Gallery;
          this.dataForm.patchValue({siteLogo: image.url});
          this.pickedImage = image.url;
        }
      }
    });
  }

  public openGalleryDialog1() {
    const dialogRef = this.dialog.open(AllImagesDialogComponent, {
      data: {type: 'single', count: 1},
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {
          const image: Gallery = dialogResult.data[0] as Gallery;
          this.dataForm.patchValue({navLogo: image.url});
          this.pickedImage1 = image.url;
        }
      }
    });
  }

  public openGalleryDialog2() {
    const dialogRef = this.dialog.open(AllImagesDialogComponent, {
      data: {type: 'single', count: 1},
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {
          const image: Gallery = dialogResult.data[0] as Gallery;
          this.dataForm.patchValue({footerLogo: image.url});
          this.pickedImage2 = image.url;
        }
      }
    });
  }


  public openGalleryPdfDialog() {
    const dialogRef = this.dialog.open(AllFileDialogComponent, {
      data: {type: 'multiple', count: 1},
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {
          const categoryPdfFile: Gallery = dialogResult.data[0] as Gallery;
          console.log('pdfFile',categoryPdfFile)
          this.dataForm.patchValue({categoryPdfFile: categoryPdfFile.url});
          this.categoryPdfFile = categoryPdfFile.url;
        }
      }
    });
  }

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
