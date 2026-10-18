import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {Author} from 'src/app/interfaces/common/author.interface';
import {UiService} from '../../../../services/core/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthorService} from '../../../../services/common/author.service';
import {FileUploadService} from 'src/app/services/gallery/file-upload.service';
import {AllImagesDialogComponent} from '../../../gallery/images/all-images-dialog/all-images-dialog.component';
import {Gallery} from '../../../../interfaces/gallery/gallery.interface';
import {MatDialog} from '@angular/material/dialog';
import {defaultUploadImage} from '../../../../core/utils/app-data';
import {UtilsService} from '../../../../services/core/utils.service';

@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html',
  styleUrls: ['./add-author.component.scss'],
})
export class AddAuthorComponent implements OnInit {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;
  // Ngx Quill
  modules: any = null;
  // Store Data
  id?: string;
  author?: Author;
  autoSlug = true;

  // Image Upload
  files: File[] = [];
  oldImage: string[] = [];
  removeImage: string;

  // Image Picker
  pickedImage = defaultUploadImage;
  pickedMobileImage = defaultUploadImage;


  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subRouteOne: Subscription;
  private subAutoSlug: Subscription;
  private subAutoSlugName: Subscription;


  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private authorService: AuthorService,
    private router: Router,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
  ) {}

  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getAuthorById();
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
      nameEn: [null],
      slug: [null],
      image: [null],
      address: [null],
      addressEn: [null],
      priority: [null],
      description: [null],
      descriptionEn: [null],
      birthDate: [null],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue({
      ...this.author,
      slug: this.normalizeSlug(this.resolveSlugSource(this.author)),
    });

    if (this.author && this.author.image) {
      this.pickedImage = this.author.image;
    }
  }

  private containsBengali(value?: string | null): boolean {
    return /[\u0980-\u09FF]/.test(value || '');
  }

  private resolveSlugSource(input?: {
    slug?: string;
    nameEn?: string;
    name?: string;
  } | null): string {
    if (!input) {
      return '';
    }

    if (input.nameEn?.trim()) {
      return input.nameEn.trim();
    }

    if (input.slug?.trim() && !this.containsBengali(input.slug)) {
      return input.slug.trim();
    }

    return input.name?.trim() || '';
  }

  private normalizeSlug(value?: string | null): string {
    if (!value?.trim()) {
      return '';
    }

    return this.utilsService.transformToSlug(value.trim());
  }

  private prepareSubmitData() {
    const raw = this.dataForm.value;

    return {
      ...raw,
      slug: this.normalizeSlug(this.resolveSlugSource(raw)),
    };
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      console.log(this.dataForm.errors);
      this.uiService.warn('Please filed all the required field');
      return;
    }
    if (this.author) {

        this.updateAuthorById();

    } else {

        this.addAuthor();

    }
  }

  /**
   * HTTP REQ HANDLE
   * getAuthorById()
   * addAuthor()
   * updateAuthorById()
   */

  private getAuthorById() {
    this.spinnerService.show();
    this.subDataOne = this.authorService.getAuthorById(this.id).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.data) {
          this.author = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        console.log(error);
      },
    });
  }

  private addAuthor() {
    this.spinnerService.show();
    this.subDataTwo = this.authorService
      .addAuthor(this.prepareSubmitData())
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

  private updateAuthorById() {
    this.spinnerService.show();
    this.subDataThree = this.authorService
      .updateAuthorById(this.author._id, this.prepareSubmitData())
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
      this.subAutoSlug?.unsubscribe();
      this.subAutoSlugName?.unsubscribe();
      this.subAutoSlug = this.dataForm.get('nameEn').valueChanges.subscribe(() => {
        this.patchAutoSlug();
      });
      this.subAutoSlugName = this.dataForm.get('name').valueChanges.subscribe(() => {
        this.patchAutoSlug();
      });
      this.patchAutoSlug();
    } else {
      this.subAutoSlug?.unsubscribe();
      this.subAutoSlugName?.unsubscribe();
    }
  }

  private patchAutoSlug() {
    const source = this.resolveSlugSource({
      nameEn: this.dataForm.get('nameEn')?.value,
      name: this.dataForm.get('name')?.value,
      slug: this.dataForm.get('slug')?.value,
    });

    this.dataForm.patchValue({
      slug: this.normalizeSlug(source),
    }, { emitEvent: false });
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
    if (this.subAutoSlugName) {
      this.subAutoSlugName.unsubscribe();
    }
  }
}
