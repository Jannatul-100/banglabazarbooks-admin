import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators,} from '@angular/forms';
import {Select} from '../../../interfaces/core/select';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {UiService} from '../../../services/core/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ProductService} from '../../../services/common/product.service';
import {UtilsService} from '../../../services/core/utils.service';
import {Product} from '../../../interfaces/common/product.interface';
import {
  COUNTRY,
  DISCOUNT_TYPES,
  EMI_MONTHS,
  Language,
  PRODUCT_STATUS,
  Version,
  VersionEn,
} from '../../../core/utils/app-data';
import {FilterData} from '../../../interfaces/core/filter-data';
import {Tag} from '../../../interfaces/common/tag.interface';
import {TagService} from '../../../services/common/tag.service';
import {FileUploadService} from 'src/app/services/gallery/file-upload.service';
import {Category} from 'src/app/interfaces/common/category.interface';
import {MatDialog} from '@angular/material/dialog';
import {AllImagesDialogComponent} from '../../gallery/images/all-images-dialog/all-images-dialog.component';
import {Gallery} from '../../../interfaces/gallery/gallery.interface';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Pagination} from "../../../interfaces/core/pagination";
import {AuthorService} from "../../../services/common/author.service";
import {Author} from "../../../interfaces/common/author.interface";
import {AllFileDialogComponent} from "../../gallery/file/all-file-dialog/all-file-dialog.component";
import {StringToSlugPipe} from "../../../shared/pipes/string-to-slug.pipe";
import {S3Service} from "../../../services/common/s3service.service";
import {AdminService} from "../../../services/admin/admin.service";


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  providers: [StringToSlugPipe]
})
export class AddProductComponent implements OnInit {
  selectedFile: File | null = null;
  fileUrl: string | null = null;
  // Ngx Quill
  modules: any = null;
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  countryData = COUNTRY;
  filterCountryData = [...this.countryData];
  languageData = Language;
  versionData = Version;
  versionDataEn = VersionEn;

  autoSlug = true;
  isPublisher = false;
  loggedInPublisher: any = null;

  // Form Array
  specificationDataArray?: FormArray;
  featuresDataArray?: FormArray;

  // Infinity Select
  categoryCtrl: FormControl = new FormControl();
  subCategoryCtrl: FormControl = new FormControl();
  authorCtrl: FormControl = new FormControl();
  editorCtrl: FormControl = new FormControl();
  translatorCtrl: FormControl = new FormControl();
  brandCtrl: FormControl = new FormControl();
  publisherCtrl: FormControl = new FormControl();
  authors: Author[] = [];
  translatorDataArray?: FormArray;
  translatorEnDataArray?: FormArray;
  // Store Data
  tags: Tag[] = [];
  id?: string;
  product?: Product;
  selectedCategory: Category = null;
  // Pagination
  currentPage = 1;
  dataPerPage = 10;
  totalData = 0;
  isLoading:boolean =false;
  // Image
  files: File[] = [];
  pickedImage: any[] = [];
  pickedFile: any;
  oldImages: string[] = [];
  removeImages: string[] = [];
  chooseImage?: string[] = [];
  public filteredAuthor: Author[] = [];
  // Static Data
  productStatus: Select[] = PRODUCT_STATUS;
  emiMonths: Select[] = EMI_MONTHS;
  discountTypes: Select[] = DISCOUNT_TYPES;

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
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private uiService: UiService,
    private authorService: AuthorService,
    private spinnerService: NgxSpinnerService,
    private tagService: TagService,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
    private stringToSlugPipe: StringToSlugPipe,
    private utilsService: UtilsService,
    private s3Service: S3Service,
    private adminService: AdminService,
  ) {
  }

  ngOnInit(): void {
    // Init Data Form
    this.initDataForm();

    this.isPublisher = this.adminService.getAdminRole() === 'publisher';
    if (this.isPublisher) {
      this.adminService.getLoggedInAdminData().subscribe({
        next: (res) => {
          if (res?.data?.publisher) {
            this.loggedInPublisher = res.data.publisher;
            if (!this.id) {
              this.publisherCtrl.setValue(this.loggedInPublisher);
            }
          }
        },
      });
    }

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getProductById();
      }
    });

    // Base Data
    this.getAllTags();
     // Auto Slug
     this.autoGenerateSlug();

     this.getAllAuthorList();
  }

  /**
   * FORMS METHODS
   * initDataForm()
   * setFormValue()
   * onAddNewSpecifications()
   * removeFormArrayField()
   * clearFormArray()
   * findInvalidControls()
   * onSubmit()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      slug:[null, Validators.required],
      tagline:[null],
      editionEn:[null],
      description: [null],
      shortDescription: [null],
      featureTitle: [null],
      costPrice: [null],
      profitPercent: [null],
      salePrice: [null],
      hasTax: [null],
      tax: [null],
      taglineEn: [null],
      isbn: [null],
      nameEn: [null],
      cartLimit: [null],
      sku: [null],
      emiMonth: [null],
      edition: [null],
      discountType: [null],
      discountAmount: [null],
      images: [null],
      language: [null],
      country: [null],
      quantity: [null],
      dollarPrice: [null],
      totalPages:[null],
      pdfFile:[null],
      // translatorName:[null],
      publishedDate:[null],
      preOrderReleaseDate:[null],
      currentVersion:[null],
      priority:[null],
      currentVersionEn:[null],
      trackQuantity: [null],
      seoTitle: [null],
      seoDescription: [null],
      seoKeywords: [null],
      category: this.categoryCtrl,
      subCategory: this.subCategoryCtrl,
      publisher: this.publisherCtrl,
      author: this.authorCtrl,
      editor: this.editorCtrl,
      translator: this.translatorCtrl,
      brand: this.brandCtrl,
      tags: [null],
      earnPoint: [null],
      pointType: [null],
      pointValue: [null],
      threeMonth: [null],
      sixMonth: [null],
      emiAmount: [null],
      twelveMonth: [null],
      redeemPoint: [null],
      redeemType: [null],
      redeemValue: [null],
      status: [this.productStatus[1].value, Validators.required],
      videoUrl: [null],
      unit: [null],
      freeDelivery: [false],
      isFacebookCatalog: [false],
      isPreOrder: [false],
      specifications: this.fb.array([]),
      features: this.fb.array([]),
      // Variations
      translatorName: this.fb.array([
        this.createStringElement()
      ]),
      translatorNameEn: this.fb.array([
        this.createStringElement()
      ]),
      hasVariations: [null],
    });

    this.translatorDataArray = this.dataForm.get('translatorName') as FormArray;

    this.translatorEnDataArray = this.dataForm.get('translatorNameEn') as FormArray;

    this.specificationDataArray = this.dataForm.get(
      'specifications'
    ) as FormArray;

    this.featuresDataArray = this.dataForm.get(
      'features'
    ) as FormArray;
  }

  createStringElement() {
    return this.fb.control('');
  }

  /**
   * Profit Calculation helpers
   */
  onProfitCalc() {
    // triggers change detection — no auto-fill of salePrice to keep it flexible
  }

  calcProfitAmount(): number {
    const cost = Number(this.dataForm.value['costPrice'] || 0);
    const pct = Number(this.dataForm.value['profitPercent'] || 0);
    return Math.round(cost * pct / 100);
  }

  onAddNewFormString(formControl: string) {
    (this.dataForm?.get(formControl) as FormArray).push(this.createStringElement());
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    this.isLoading =true;
    if (this.selectedFile) {
      this.s3Service.uploadFile(this.selectedFile)
        .then((url: string) => {
          this.isLoading =false;
          this.fileUrl = url; // set the uploaded file's URL
          this.dataForm.patchValue({pdfFile: this.fileUrl})
        })
        .catch(error => {
          this.isLoading =false;
          console.error('File upload failed', error);
        });
    }
  }

    /**
   * LOGICAL PART
   * autoGenerateSlug()
   */
    autoGenerateSlug() {
      if (this.autoSlug === true) {
        this.subAutoSlug = this.dataForm.valueChanges.subscribe(val => {
            const textToSlug = val.nameEn || val.name;
            if (textToSlug) {
              const res = this.stringToSlugPipe.transform(textToSlug, '-');
              this.dataForm.patchValue({ slug: res }, { emitEvent: false });
            }
        });
      } else {
        if (!this.subAutoSlug) {
          return;
        }
        this.subAutoSlug?.unsubscribe();
      }
    }

  private setFormValue() {
    this.dataForm.patchValue(this.product);

    if (this.product && this.product.isFacebookCatalog === undefined) {
      this.dataForm.patchValue({ isFacebookCatalog: false });
    }

    if (this.product && this.product.preOrderReleaseDate) {
      this.dataForm.patchValue({
        preOrderReleaseDate: new Date(this.product.preOrderReleaseDate)
      });
    }


    // Set Image
    if (this.product.images && this.product.images.length) {
      this.chooseImage = this.product.images;
    }
    if (this.product.pdfFile && this.product.pdfFile.length) {
      this.pickedFile = this.product.pdfFile;
    }

    // Tags
    if (this.product.tags && this.product.tags.length) {
      this.dataForm.patchValue({
        tags: this.product.tags.map((m) => m._id)
      });
    }

    if (this.product && this.product.author) {
      this.dataForm.patchValue({
        author: this.product.author
      });
    }

    if (this.product && this.product.editor) {
      this.dataForm.patchValue({
        editor: this.product.editor
      });
    }

    if (this.product && this.product.translator) {
      this.dataForm.patchValue({
        translator: this.product.translator
      });
    }

    // Form Array Specifications
    if (this.product.specifications && this.product.specifications.length) {
      this.product.specifications.map((m) => {
        const f = this.fb.group({
          name: [m.name],
          value: [m.value],
          type: [m.type],
        });
        (this.dataForm?.get('specifications') as FormArray).push(f);
      });
    }

    this.translatorDataArray.removeAt(0);
    this.translatorEnDataArray.removeAt(0);
    this.product.translatorName?.forEach(f => {
      const ctrl = this.fb.control(f);
      (this.dataForm?.get('translatorName') as FormArray).push(ctrl);
    });

    this.product.translatorNameEn?.forEach(f => {
      const ctrl = this.fb.control(f);
      (this.dataForm?.get('translatorNameEn') as FormArray).push(ctrl);
    });

    // Form Array Features
    if (this.product.features && this.product.features.length) {
      this.product.features.map((m) => {
        const f = this.fb.group({
          name: [m.name],
          value: [m.value],
        });
        (this.dataForm?.get('features') as FormArray).push(f);
      });
    }

  }

  onAddNewSpecifications() {
    const f = this.fb.group({
      name: [null],
      value: [null],
      type: [this.dataForm.value.specifications.length ? this.dataForm.value.specifications[this.dataForm.value.specifications.length - 1].type : null,],
    });
    (this.dataForm?.get('specifications') as FormArray).push(f);
  }

  onAddNewFeatures() {
    const f = this.fb.group({
      name: [null],
      value: [null],
    });
    (this.dataForm?.get('features') as FormArray).push(f);
  }

  removeFormArrayField(formControl: string, index: number) {
    let formDataArray: FormArray;
    switch (formControl) {
      case 'specifications': {
        formDataArray = this.specificationDataArray;
        break;
      }
      case 'translatorName': {
        formDataArray = this.translatorDataArray;
        break;
      }
      case 'translatorNameEn': {
        formDataArray = this.translatorEnDataArray;
        break;
      }
      default: {
        formDataArray = null;
        break;
      }
    }
    formDataArray?.removeAt(index);
  }

  removeFeaturesFormArrayField(formControl: string, index: number) {
    let formDataArray: FormArray;
    switch (formControl) {
      case 'features': {
        formDataArray = this.featuresDataArray;
        break;
      }
      default: {
        formDataArray = null;
        break;
      }
    }
    formDataArray?.removeAt(index);
  }




  saveAsDraft() {
    this.dataForm.patchValue({ status: 'draft' });
    this.onSubmit();
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }

    const mData = {
      ...this.dataForm.value,
      ...{
        category: {
          _id: this.dataForm.value.category._id,
          name: this.dataForm.value.category.name,
          nameEn: this.dataForm.value.category.nameEn,
          slug: this.dataForm.value.category.slug,
        },
        cartLimit: this.dataForm.value.cartLimit
          ? this.dataForm.value.cartLimit
          : 0,
      },
    };

    if (mData.pdfFile) {
      mData.pdfUrl = mData.pdfFile;
    }

    // Sub Category
    if (this.dataForm.value.subCategory) {
      mData.subCategory = {
        _id: this.dataForm.value.subCategory._id,
        name: this.dataForm.value.subCategory.name,
        slug: this.dataForm.value.subCategory.slug,
      };
    } else {
      mData.subCategory = null;
    }

    // Author
    // if (this.dataForm.value.author) {
    //   mData.author = {
    //     _id: this.dataForm.value.author._id,
    //     name: this.dataForm.value.author.name,
    //     slug: this.dataForm.value.author.slug,
    //   };
    // }

    // Author & Editor & Translator (Optional)
    const hasAuthor = this.dataForm.value.author && (Array.isArray(this.dataForm.value.author) ? this.dataForm.value.author.length > 0 : !!this.dataForm.value.author);
    const hasEditor = this.dataForm.value.editor && (Array.isArray(this.dataForm.value.editor) ? this.dataForm.value.editor.length > 0 : !!this.dataForm.value.editor);
    const hasTranslator = this.dataForm.value.translator && (Array.isArray(this.dataForm.value.translator) ? this.dataForm.value.translator.length > 0 : !!this.dataForm.value.translator);

    // Author
    if (this.dataForm.value.author && Array.isArray(this.dataForm.value.author)) {
      mData.author = this.dataForm.value.author.map((m: any) => ({
        _id: m._id,
        name: m.name,
        nameEn: m.nameEn,
        slug: m.slug,
      }));
    } else if (this.dataForm.value.author) {
      mData.author = [{
        _id: this.dataForm.value.author._id,
        name: this.dataForm.value.author.name,
        nameEn: this.dataForm.value.author.nameEn,
        slug: this.dataForm.value.author.slug,
      }];
    } else {
      mData.author = [];
    }

    // Editor
    if (this.dataForm.value.editor && Array.isArray(this.dataForm.value.editor)) {
      mData.editor = this.dataForm.value.editor.map((m: any) => ({
        _id: m._id,
        name: m.name,
        nameEn: m.nameEn,
        slug: m.slug,
      }));
    } else if (this.dataForm.value.editor) {
      mData.editor = [{
        _id: this.dataForm.value.editor._id,
        name: this.dataForm.value.editor.name,
        nameEn: this.dataForm.value.editor.nameEn,
        slug: this.dataForm.value.editor.slug,
      }];
    } else {
      mData.editor = [];
    }

    // Translator
    if (this.dataForm.value.translator && Array.isArray(this.dataForm.value.translator)) {
      mData.translator = this.dataForm.value.translator.map((m: any) => ({
        _id: m._id,
        name: m.name,
        nameEn: m.nameEn,
        slug: m.slug,
      }));
    } else if (this.dataForm.value.translator) {
      mData.translator = [{
        _id: this.dataForm.value.translator._id,
        name: this.dataForm.value.translator.name,
        nameEn: this.dataForm.value.translator.nameEn,
        slug: this.dataForm.value.translator.slug,
      }];
    } else {
      mData.translator = [];
    }

    // Sync translator names for backward compatibility if translator is selected
    if (mData.translator && mData.translator.length) {
      const transNames = mData.translator.map((t: any) => t.name).filter(Boolean);
      const transNamesEn = mData.translator.map((t: any) => t.nameEn).filter(Boolean);
      if (transNames.length && (!mData.translatorName || !mData.translatorName.length)) {
        mData.translatorName = transNames;
      }
      if (transNamesEn.length && (!mData.translatorNameEn || !mData.translatorNameEn.length)) {
        mData.translatorNameEn = transNamesEn;
      }
    }

    // Publisher
    if (this.isPublisher && this.loggedInPublisher) {
      mData.publisher = {
        _id: this.loggedInPublisher._id,
        name: this.loggedInPublisher.name,
        slug: this.loggedInPublisher.slug,
      };
      if (!this.product) {
        mData.status = 'draft';
      }
    } else if (this.dataForm.value.publisher) {
      mData.publisher = {
        _id: this.dataForm.value.publisher._id,
        name: this.dataForm.value.publisher.name,
        slug: this.dataForm.value.publisher.slug,
      };
    }

    // Tags
    if (this.dataForm.value.tags) {
      mData.tags = [];
      this.dataForm.value.tags.forEach((m) => {
        const foundTag = this.tags.find((f) => String(f._id) === m);
        if (foundTag) {
          mData.tags.push({
            _id: foundTag._id,
            name: foundTag.name,
            slug: foundTag.slug,
          });
        }
      });
    }


    // Main Function
    if (this.product) {

      this.updateProductById(mData);

    } else {

      this.addProduct(mData);

    }
  }


  /**
   * HTTP REQ HANDLE
   * getAllTags()
   getProductById()
   * addProduct()
   * updateProductById()
   * deleteMultipleFile()
   */

  private getAllTags() {
    // Select
    const mSelect = {
      name: 1,
      slug: 1,
    };

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: {name: 1},
    };

    this.subDataOne = this.tagService.getAllTag(filterData, null).subscribe({
      next: res => {
        this.tags = res.data;

      },
      error: error => {
        console.log(error);
      }
    });
  }

  private getProductById() {
    this.spinnerService.show();
    this.subDataThree = this.productService.getProductById(this.id).subscribe({
      next: res => {
        this.spinnerService.hide();
        if (res.success) {
          this.product = res.data;
          this.setFormValue();
        }
      },
      error: error => {
        this.spinnerService.hide();
        console.log(error);
      }

    })

  }

  /**
   * HTTP REQ HANDLE
   * getAllAuthorList()
   */

  private getAllAuthorList() {
    // Select
    const mSelect = {
      name: 1,
      nameEn: 1,
      slug: 1,
    };

    const pagination: Pagination = {
      pageSize: this.dataPerPage,
      currentPage: this.currentPage - 1
    };

    const filter: FilterData = {
      filter: null,
      pagination: null,
      select: mSelect,
      sort: { createdAt: -1 },
    };

    // Removed getAllAuthor to prevent loading all authors at once
  }



  private addProduct(data: any) {
    this.spinnerService.show();
    this.subDataTwo = this.productService.addProduct(data).subscribe({
      next: res => {
        this.spinnerService.hide();
        if (res.success) {
          this.uiService.success(res.message);
          this.formElement.resetForm();
          this.files = [];
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: error => {
        this.spinnerService.hide();
        console.log(error);
      }
    });
  }

  private updateProductById(data: any) {
    this.spinnerService.show();
    this.subDataFour = this.productService
      .updateProductById(this.product._id, data)
      .subscribe({
        next: res => {
          this.spinnerService.hide();
          if (res.success) {
            this.uiService.success(res.message);

            // Remove Old Image from Backend
            if (this.removeImages && this.removeImages.length) {
              this.deleteMultipleFile(this.removeImages);
              this.removeImages = [];
            }
            this.files = [];
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: error => {
          this.spinnerService.hide();
          console.log(error);
        }
      });

  }


  private deleteMultipleFile(data: string[]) {
    this.subDataFive = this.fileUploadService.deleteMultipleFile(data).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  /**
   * IMAGE UPLOAD
   * onSelect()
   * patchPickedImagesUnique()
   * drop()
   * onRemove()
   * removeSelectImage()
   */

  onSelect(event: { addedFiles: any }) {
    this.files.push(...event.addedFiles);
  }


  private patchPickedImagesUnique(images: Gallery[]) {
    if (this.chooseImage && this.chooseImage.length > 0) {
      const nImages = images.map(m => m.url);
      this.chooseImage = this.utilsService.mergeArrayString(nImages, this.chooseImage);
    } else {
      this.chooseImage = images.map(m => m.url);
    }
    this.dataForm.patchValue(
      {images: this.chooseImage}
    );
  }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.chooseImage, event.previousIndex, event.currentIndex);
  }

  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }
  removeSelectImage(s: string) {
    const index = this.chooseImage.findIndex(x => x === s);
    this.chooseImage.splice(index, 1);
  }

  /**
   * ON CATEGORY SELECT
   * onCategorySelect()
   * getEmiInput()
   */
  onCategorySelect(data: Category) {
    if (data) {
      this.selectedCategory = data;
    }
  }

  getEmiInput(value: number) {
    if (this.dataForm.value.emiMonth && this.dataForm.value.emiMonth.length) {
      const fIndex = this.dataForm.value.emiMonth.findIndex(f => f == value)
      if (fIndex > -1) {
        return value;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }


  /**
   * OPEN COMPONENT DIALOG
   * openGalleryDialog()
   */

  public openGalleryDialog() {
    const dialogRef = this.dialog.open(AllImagesDialogComponent, {
      data: {type: 'multiple', count: this.chooseImage.length ? (10 - this.chooseImage.length) : 10},
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {
          this.patchPickedImagesUnique(dialogResult.data);
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
          const pdfFile: Gallery = dialogResult.data[0] as Gallery;
          console.log('pdfFile',pdfFile)
          this.dataForm.patchValue({pdfFile: pdfFile.url});
          this.pickedFile = pdfFile.url;
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
  }
}
