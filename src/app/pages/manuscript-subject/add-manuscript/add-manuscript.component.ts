import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {ManuscriptSubject} from "../../../interfaces/common/manuscript-subject.interface";
import {Select} from "../../../interfaces/core/select";
import {defaultUploadImage, PRODUCT_STATUS} from "../../../core/utils/app-data";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";
import {ManuscriptSubjectService} from "../../../services/common/manuscript-subject.service";
import {FileUploadService} from "../../../services/gallery/file-upload.service";
import {MatDialog} from "@angular/material/dialog";
import {AllImagesDialogComponent} from "../../gallery/images/all-images-dialog/all-images-dialog.component";
import {Gallery} from "../../../interfaces/gallery/gallery.interface";

@Component({
  selector: 'app-add-manuscript',
  templateUrl: './add-manuscript.component.html',
  styleUrls: ['./add-manuscript.component.scss']
})
export class AddManuscriptComponent implements OnInit {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  id?: string;
  manuscriptSubject?: ManuscriptSubject;
  autoSlug = true;
  productStatus: Select[] = PRODUCT_STATUS;


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
    private manuscriptSubjectService: ManuscriptSubjectService,
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
        this.getManuscriptSubjectById();
      }
    });
    // Auto Slug
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
      name: [null],
      slug: [null],
      image: [null],
      status: ['publish'],
      description: [null],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.manuscriptSubject);
    if (this.manuscriptSubject && this.manuscriptSubject.image) {
      this.pickedImage = this.manuscriptSubject.image;
    }
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      console.log(this.dataForm.errors);
      this.uiService.warn('Please filed all the required field');
      return;
    }
    if (!this.manuscriptSubject) {
      this.addManuscriptSubject()
    } else {
      this.updateManuscriptSubjectById()
    }
  }

  /**
   * HTTP REQ HANDLE
   * getManuscriptSubjectById()
   * addManuscriptSubject()
   * updateManuscriptSubjectById()
   * removeSingleFile()
   */

  private getManuscriptSubjectById() {
    this.spinnerService.show();
    this.subDataOne = this.manuscriptSubjectService.getManuscriptSubjectById(this.id).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.data) {
          this.manuscriptSubject = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        console.log(error);
      },
    });
  }

  private addManuscriptSubject() {
    this.spinnerService.show();
    this.subDataTwo = this.manuscriptSubjectService
      .addManuscriptSubject(this.dataForm.value)
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

  private updateManuscriptSubjectById() {
    this.spinnerService.show();
    this.subDataThree = this.manuscriptSubjectService
      .updateManuscriptSubjectById(this.manuscriptSubject._id, this.dataForm.value)
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
  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.subAutoSlug = this.dataForm.get('name').valueChanges
        .pipe(
          // debounceTime(200),
          // distinctUntilChanged()
        ).subscribe(d => {
          const res = d?.trim().replace(/\s+/g, '-').toLowerCase();
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

  // protected readonly PRODUCT_STATUS = PRODUCT_STATUS;
}
