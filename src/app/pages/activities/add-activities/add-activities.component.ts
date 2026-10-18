import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Activities} from "../../../interfaces/common/activities.interface";
import {defaultUploadImage} from "../../../core/utils/app-data";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";
import {ActivitiesService} from "../../../services/common/activities.service";
import {FileUploadService} from "../../../services/gallery/file-upload.service";
import {MatDialog} from "@angular/material/dialog";
import {StringToSlugPipe} from "../../../shared/pipes/string-to-slug.pipe";
import {AllImagesDialogComponent} from "../../gallery/images/all-images-dialog/all-images-dialog.component";
import {Gallery} from "../../../interfaces/gallery/gallery.interface";

@Component({
  selector: 'app-add-activities',
  templateUrl: './add-activities.component.html',
  styleUrls: ['./add-activities.component.scss'],
  providers: [StringToSlugPipe]
})
export class AddActivitiesComponent  implements OnInit {


  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;
  // Ngx Quill
  modules: any = null;
  // Store Data
  id?: string;
  activities?: Activities;
  autoSlug = true;

  // Image Picker
  pickedImage = defaultUploadImage;
  pickedMobileImage = defaultUploadImage;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  private subDataSix: Subscription;
  private subRouteOne: Subscription;
  private subAutoSlug: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private activitiesService: ActivitiesService,
    private router: Router,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
    private stringToSlugPipe: StringToSlugPipe,
  ) {
  }


  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getActivitiesById();
      }
    });
    this.autoGenerateSlug();
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
      nameEn: [null],
      slug: [null, Validators.required],
      priority: [null],
      authorName: [null],
      shortDesc: [null],
      shortDescEn: [null],
      image: [null],
      mobileImage: [null],
      description: [null],
      descriptionEn: [null]
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.activities);

    if (this.activities && this.activities.image) {
      this.pickedImage = this.activities.image;
    }
  }

  onSubmit() {

    if (this.dataForm.invalid) {
      console.log(this.dataForm.errors)
      this.uiService.warn('Please filed all the required field');
      return;
    }
    if (this.activities) {

      this.updateActivitiesById();

    } else {

      this.addActivities();

    }
  }

  /**
   * HTTP REQ HANDLE
   * getActivitiesById()
   * addActivities()
   * updateActivitiesById()
   */

  private getActivitiesById() {
    this.spinnerService.show();
    this.subDataOne = this.activitiesService.getActivitiesById(this.id)
      .subscribe({
        next: (res => {
          this.spinnerService.hide();
          if (res.data) {
            this.activities = res.data;
            this.setFormValue();
          }
        }),
        error: (error => {
          this.spinnerService.hide();
          console.log(error);
        })
      });
  }

  private addActivities() {
    this.spinnerService.show();
    this.subDataTwo = this.activitiesService.addActivities(this.dataForm.value)
      .subscribe({
        next: (res => {
          this.spinnerService.hide();
          if (res.success) {
            this.uiService.success(res.message);
            this.formElement.resetForm();
            this.pickedImage = defaultUploadImage;
          } else {
            this.uiService.warn(res.message);
          }
        }),
        error: (error => {
          this.spinnerService.hide();
          console.log(error);
        })
      });
  }

  private updateActivitiesById() {
    this.spinnerService.show();
    this.subDataThree = this.activitiesService.updateActivitiesById(this.activities._id, this.dataForm.value)
      .subscribe({
        next: (res => {
          this.spinnerService.hide();
          if (res.success) {
            this.uiService.success(res.message);
          } else {
            this.uiService.warn(res.message);
          }

        }),
        error: (error => {
          this.spinnerService.hide();
          console.log(error);
        })
      });
  }

  /**
   * LOGICAL PART
   * autoGenerateSlug()
   */
  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.subAutoSlug = this.dataForm.get('nameEn').valueChanges
        .pipe(
          // debounceTime(200),
          // distinctUntilChanged()
        ).subscribe(d => {
          const res = this.stringToSlugPipe.transform(d, '-')
          this.dataForm.patchValue({
            slug: res
          });
        });
    } else {
      if (!this.subAutoSlug) {
        return;
      }
      this.subAutoSlug?.unsubscribe();
    }
  }


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
    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
    if (this.subDataFive) {
      this.subDataFive.unsubscribe();
    }
    if (this.subDataSix) {
      this.subDataSix.unsubscribe();
    }
    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
    if(this.subAutoSlug){
      this.subAutoSlug.unsubscribe();
    }
  }

}
