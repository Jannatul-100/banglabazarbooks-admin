import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {defaultUploadImage} from "../../../core/utils/app-data";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";
import {YoutubeVideoService} from "../../../services/common/youtube-video.service";
import {FileUploadService} from "../../../services/gallery/file-upload.service";
import {MatDialog} from "@angular/material/dialog";
import {AllImagesDialogComponent} from "../../gallery/images/all-images-dialog/all-images-dialog.component";
import {Gallery} from "../../../interfaces/gallery/gallery.interface";
import {YoutubeVideo} from "../../../interfaces/common/youtube-video.interface";

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss']
})
export class AddVideoComponent implements OnInit {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  id?: string;
  youtubeVideo?: YoutubeVideo;

  // Image Picker
  pickedImage = defaultUploadImage;
  pickedMobileImage = defaultUploadImage;



  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subRouteOne: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private youtubeVideoService: YoutubeVideoService,
    private router: Router,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getYoutubeVideoById();
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
      name: [null],
      image: [null],
      // mobileImage: [null],
      // amount: [null],
      title: [null],
      titleEn: [null],
      url: [null],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.youtubeVideo);
    if (this.youtubeVideo && this.youtubeVideo.image) {
      this.pickedImage = this.youtubeVideo.image;
    }
    // if (this.youtubeVideo && this.youtubeVideo.mobileImage) {
    //   this.pickedMobileImage = this.youtubeVideo.mobileImage;
    // }
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }

    if (!this.youtubeVideo) {
      this.addYoutubeVideo();
    } else {
      this.updateYoutubeVideoById();
    }

  }

  /**
   * HTTP REQ HANDLE
   * getYoutubeVideoById()
   * addYoutubeVideo()
   * updateYoutubeVideoById()
   */

  private getYoutubeVideoById() {
    this.spinnerService.show();
    this.subDataOne = this.youtubeVideoService.getYoutubeVideoById(this.id).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.data) {
          this.youtubeVideo = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        console.log(error);
      },
    });
  }

  private addYoutubeVideo() {
    this.spinnerService.show();
    this.subDataTwo = this.youtubeVideoService
      .addYoutubeVideo(this.dataForm.value)
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

  private updateYoutubeVideoById() {
    this.spinnerService.show();
    this.subDataThree = this.youtubeVideoService
      .updateYoutubeVideoById(this.youtubeVideo._id, this.dataForm.value)
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
