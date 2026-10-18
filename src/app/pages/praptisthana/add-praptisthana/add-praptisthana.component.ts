import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Praptisthana} from "../../../interfaces/common/praptisthana.interface";
import {defaultUploadImage} from "../../../core/utils/app-data";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";
import {PraptisthanaService} from "../../../services/common/praptisthana.service";
import {FileUploadService} from "../../../services/gallery/file-upload.service";
import {MatDialog} from "@angular/material/dialog";
import {AllImagesDialogComponent} from "../../gallery/images/all-images-dialog/all-images-dialog.component";
import {Gallery} from "../../../interfaces/gallery/gallery.interface";
import {FilterData} from "../../../interfaces/core/filter-data";
import {ZoneService} from "../../../services/common/zone.service";
import {AreaService} from "../../../services/common/area.service";
import {DivisionService} from "../../../services/common/division.service";
import {Area} from "../../../interfaces/common/area.interface";
import {Division} from "../../../interfaces/common/division.interface";
import {Zone} from "../../../interfaces/common/zone.interface";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-add-praptisthana',
  templateUrl: './add-praptisthana.component.html',
  styleUrls: ['./add-praptisthana.component.scss']
})
export class AddPraptisthanaComponent implements OnInit {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  id?: string;
  praptisthana?: Praptisthana;
  autoSlug = true;

  divisions: Division[] = [];
  area: Area[] = [];
  zone: Zone[] = [];

  private subDivisionData: Subscription;
  private subAreaData: Subscription;
  private subZoneData: Subscription;


  // Image Upload
  files: File[] = [];



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
    private praptisthanaService: PraptisthanaService,
    private router: Router,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
    private divisionService: DivisionService,
    private areaService: AreaService,
    private zoneService: ZoneService,
  ) {
  }

  ngOnInit(): void {
    // Init Form
    this.initDataForm();
    this.patchData();
    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getPraptisthanaById();
      }
    });
    this.getAllDivision();
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
      priority: [null],
      division: [null, Validators.required],
      area: [null, Validators.required],
      zone: [null],
      image: [null],
      phone: [null],
      address: [null],
      url: [null],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.praptisthana);

    if (this.praptisthana && this.praptisthana.division) {
      this.dataForm.patchValue({
        division: this.praptisthana.division._id
      });
      this.onDivisionSelect({value: this.praptisthana.division._id});
    }

    if (this.praptisthana && this.praptisthana.area) {
      this.dataForm.patchValue({
        area: this.praptisthana.area._id
      });
      this.onChangeArea({value: this.praptisthana.area._id});
    }

    this.dataForm.patchValue({ zone: this.praptisthana?.zone?._id });

    if (this.praptisthana && this.praptisthana.image) {
      this.pickedImage = this.praptisthana.image;

    }
    if (this.praptisthana && this.praptisthana.mobileImage) {
      this.pickedMobileImage = this.praptisthana.mobileImage;
    }
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }
    // const selectedDivision = this.divisions.find(f => f._id === this.dataForm.value.division);
    // const selectedArea = this.areas.find(f => f._id === this.dataForm.value.area);
    //

    // let mData = {
    //   ...this.dataForm.value,
    //   ...{
    //     division: {
    //       _id: this.dataForm.value.division,
    //       name: this.divisions.find(f => f._id === this.dataForm.value.division)?.name,
    //     },
    //   }
    // };
    //
    // // If has Sub Category
    // if (this.dataForm.value.area) {
    //   mData = {
    //     ...mData, ...{
    //       area: {
    //         _id: this.dataForm.value.area,
    //         name: this.area.find(f => f._id === this.dataForm.value.area)?.name,
    //       }
    //     }
    //   }
    // }
    //
    // // If has Sub Category
    // if (this.dataForm.value.zone) {
    //   mData = {
    //     ...mData, ...{
    //       zone: {
    //         _id: this.dataForm.value.zone,
    //         name: this.zone.find(f => f._id === this.dataForm.value.zone)?.name,
    //       }
    //     }
    //   }
    // }

    let selectDivision = this.divisions.find((d) => d._id === this.dataForm.value.division);
    let selectArea = this.area.find((d) => d._id === this.dataForm.value.area);
    let selectZone = this.zone.find((d) => d._id === this.dataForm.value.zone);

    const mData = {
      ...this.dataForm.value,
      ...{
        division: selectDivision,
        area: selectArea,
        zone: selectZone,
      }
    }

    if (mData) {
      if (!this.praptisthana) {
        this.addPraptisthana(mData);
      } else {
        this.updatePraptisthanaById(mData);
      }
    }
  }

  /**
   * HTTP REQ HANDLE
   * getPraptisthanaById()
   * addPraptisthana()
   * updatePraptisthanaById()
   */

  private getPraptisthanaById() {
    this.spinnerService.show();
    this.subDataOne = this.praptisthanaService.getPraptisthanaById(this.id).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.data) {
          this.praptisthana = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        console.log(error);
      },
    });
  }

  private addPraptisthana(mData) {
    this.spinnerService.show();
    this.subDataTwo = this.praptisthanaService
      .addPraptisthana(mData)
      .subscribe({
        next: (res) => {
          this.spinnerService.hide();
          if (res.success) {
            this.uiService.success(res.message);
            this.formElement.resetForm();
            this.pickedImage = defaultUploadImage;
            this.pickedMobileImage = defaultUploadImage;
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

  private updatePraptisthanaById(mData) {
    this.spinnerService.show();
    this.subDataThree = this.praptisthanaService
      .updatePraptisthanaById(this.praptisthana._id, mData)
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

  patchData() {
   if (this.praptisthana) {
      this.dataForm.patchValue({...this.praptisthana});
     this.dataForm.patchValue({ division: this.praptisthana?.division?._id });
     this.dataForm.patchValue({ area: this.praptisthana?.area?._id });
    this.dataForm.patchValue({ zone: this.praptisthana?.zone?._id });
    // this.getAllArea(this.dataForm.get('division')?.value);
    // this.getAllZone(this.dataForm.get('area')?.value);
     if (this.praptisthana && this.praptisthana.division) {
       this.dataForm.patchValue({
         division: this.praptisthana.division._id
       });
       this.onDivisionSelect({value: this.praptisthana.division._id});
     }

     if (this.praptisthana && this.praptisthana.area) {
       this.dataForm.patchValue({
         area: this.praptisthana.area._id
       });
       this.onChangeArea({value: this.praptisthana.area._id});
     }
     // this.dataForm.patchValue({
     //     ...{
     //       division: this.praptisthana.division._id,
     //       area: this.praptisthana.area._id,
     //       zone: this.praptisthana.zone._id,
     //     }
     //   }
     // );

     // Get Sub Category By Category
     // if (this.praptisthana.division) {
     //   this.getAllZone(this.praptisthana.division._id);
     // }
    // this.isEdit = true;
    // this.selectEdittedAdress = this.data;
    // } else {
    //   // this.isEdit = false;
     }
  }

  /***
   * HTTP REQUEST HANDLE
   * getAllDivision()
   * getAllArea()
   * getAllZone()
   * addAddress()
   * getUserAddress()
   *
   */

  private getAllDivision() {
    let mSelect = {
      name: 1,
    }
    const filter: FilterData = {
      filter: { status: 'publish' },
      select: mSelect,
      pagination: null,
      sort: { name: 1 }
    }

    this.subDivisionData = this.divisionService.getAllDivisions(filter).subscribe(
      (res) => {
        if (res.success) {
          this.divisions = res.data;
        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    )
  }

  private getAllArea(id: string) {
    const select = 'name';
    this.subAreaData = this.areaService.getAreaByParentId(id, select).subscribe(
      (res) => {
        if (res.success) {
          this.area = res.data;
        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    )
  }

  private getAllZone(id: string) {
    const select = 'name';
    this.subZoneData = this.zoneService.getZoneByParentId(id, select).subscribe(
      (res) => {
        if (res.success) {
          this.zone = res.data;
        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    )
  }

  onChangeRegion(event: any) {
    if (event) {
      this.getAllArea(this.dataForm.get('division')?.value);
    }
    // let selectDivision = this.divisions.find((d) => d._id === this.dataForm.value.division);

  }

  onDivisionSelect(event: MatSelectChange | any) {
    if (event.value) {
      this.getAllArea(event.value);
    }
  }


  onChangeArea(event: any) {
    if (event) {
      // console.log(this.dataForm.get('area')?.value);
      this.getAllZone(this.dataForm.get('area')?.value);
    }
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
  }
}
