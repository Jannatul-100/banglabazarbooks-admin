import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {Notification} from "../../../interfaces/common/notification.interface";
import {defaultUploadImage} from "../../../core/utils/app-data";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "../../../services/common/notification.service";
import {FileUploadService} from "../../../services/gallery/file-upload.service";
import {MatDialog} from "@angular/material/dialog";
import {AllImagesDialogComponent} from "../../gallery/images/all-images-dialog/all-images-dialog.component";
import {Gallery} from "../../../interfaces/gallery/gallery.interface";

@Component({
  selector: 'app-add-notification',
  templateUrl: './add-notification.component.html',
  styleUrls: ['./add-notification.component.scss']
})
export class AddNotificationComponent implements OnInit {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;
  modules: any = null;
  // Store Data
  id?: string;
  notification?: Notification;
  autoSlug = true;


  // Image Picker
  pickedImage = defaultUploadImage;
  pickedMobileImage = defaultUploadImage;


  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subRouteOne: Subscription;
  private subAutoSlug: Subscription;


  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getNotificationById();
      }
    });
    // Auto Slug
    // this.autoGenerateSlug();
  }

  /**
   * FORM METHODS
   * initDataForm()
   * setFormValue()
   * onSubmit()
   */

  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null],
     /* slug: [null],*/
      image: [null],
      description: [null],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.notification);
    if (this.notification && this.notification.image) {
      this.pickedImage = this.notification.image;
    }
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      // console.log(this.dataForm.errors);
      this.uiService.warn('Please filed all the required field');
      return;
    }
    if (!this.notification) {
      this.addNotification()
    } else {
      this.updateNotificationById()
    }
  }

  /**
   * HTTP REQ HANDLE
   * getNotificationById()
   * addNotification()
   * updateNotificationById()
   * removeSingleFile()
   */

  private getNotificationById() {
    this.spinnerService.show();
    this.subDataOne = this.notificationService.getNotificationById(this.id).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.data) {
          this.notification = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        console.log(error);
      },
    });
  }

  private addNotification() {
    this.spinnerService.show();
    this.subDataTwo = this.notificationService
      .addNotification(this.dataForm.value)
      .subscribe({
        next: (res) => {
          this.spinnerService.hide();
          if (res.success) {
            this.uiService.success(res.message);
            this.formElement.resetForm();

          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (error) => {
          this.spinnerService.hide();
          console.log(error);
        },
      });
  }

  private updateNotificationById() {
    this.spinnerService.show();
    this.subDataThree = this.notificationService
      .updateNotificationById(this.notification._id, this.dataForm.value)
      .subscribe({
        next: (res) => {
          this.spinnerService.hide();
          if (res.success) {

            this.uiService.success(res.message);


          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (error) => {
          this.spinnerService.hide();
          console.log(error);
        },
      });
  }


  /**
   * LOGICAL PART
   * autoGenerateSlug()
   */
  // autoGenerateSlug() {
  //   if (this.autoSlug === true) {
  //     this.subAutoSlug = this.dataForm.get('name').valueChanges
  //       .pipe(
  //         // debounceTime(200),
  //         // distinctUntilChanged()
  //       ).subscribe(d => {
  //         const res = d?.trim().replace(/\s+/g, '-').toLowerCase();
  //         this.dataForm.patchValue({
  //           slug: res
  //         });
  //       });
  //   } else {
  //     if (!this.subAutoSlug) {
  //       return;
  //     }
  //     this.subAutoSlug?.unsubscribe();
  //   }
  // }


  /**
   * COMPONENT DIALOG
   * openGalleryDialog()
   */

  public openGalleryDialog(type: 'image' | 'mobileImage') {
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
          if (type === 'mobileImage') {
            this.dataForm.patchValue({mobileImage: image.url});
            this.pickedMobileImage = image.url;
          } else {
            this.dataForm.patchValue({image: image.url});
            this.pickedImage = image.url;
          }
        }
      }
    });
  }


  /**
   * ON DESTROY
   * ngOnDestroy()
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

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
    if (this.subAutoSlug) {
      this.subAutoSlug.unsubscribe();
    }
  }
}
