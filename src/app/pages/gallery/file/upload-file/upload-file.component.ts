import {Component, Inject, OnInit} from '@angular/core';
import {FileFolder} from "../../../../interfaces/gallery/file-folder.interface";
import {FileUploadService} from "../../../../services/gallery/file-upload.service";
import {GalleryService} from "../../../../services/gallery/gallery.service";
import {UtilsService} from "../../../../services/core/utils.service";
import {ReloadService} from "../../../../services/core/reload.service";
import {UiService} from "../../../../services/core/ui.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Gallery} from "../../../../interfaces/gallery/gallery.interface";
import {FileTypes} from "../../../../enum/file-types.enum";
import {ImageConvertOption} from "../../../../interfaces/gallery/image-convert-option.interface";

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  // in app.component.ts
  files: File[] = [];
  folders: FileFolder[] = [];
  selectedFolder: string = 'Default';
  isCheckConvert: boolean = false;
  quality: string = null;
  width: string = null;
  height: string = null;


  constructor(
    private fileUploadService: FileUploadService,
    private galleryService: GalleryService,
    private utilsService: UtilsService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    public dialogRef: MatDialogRef<UploadFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileFolder[],
  ) {
  }

  ngOnInit(): void {
    if (this.data) {
      this.folders = this.data;
      console.log('this.folders',this.folders)
    }
  }

  /**
   * IMAGE DRUG & DROP
   */
  onSelect(event: { addedFiles: any; }) {
    this.files.push(...event.addedFiles);

    console.log('this.files',this.files);
  }

  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }


  /**
   * ON IMAGE UPLOAD
   */
  onUploadFiles() {
    if (!this.selectedFolder) {
      this.uiService.warn('No Folder name found!');
      return;
    }
    if (!this.files || this.files.length <= 0) {
      this.uiService.warn('No Image selected!');
      return;
    }
    // this.spinnerService.show();

    let option: ImageConvertOption = null;
    if (this.isCheckConvert) {
      option = {
        convert: 'yes',
        quality: this.quality,
        width: this.width,
        height: this.height,
      }
    }

    console.log('this.files',this.files)

    this.fileUploadService.uploadMultiFileOriginal(this.files, option)
      .subscribe(res => {
        const data: Gallery[] = res.map(m => {
          return {
            url: m.url,
            name: m.name,
            size: m.size,
            folder: this.selectedFolder,
            type: FileTypes.PDF
          } as Gallery;
        });
        console.log('data11',data)
        this.addFilesToGallery(data);

      }, error => {
        // this.spinnerService.hide();
        console.log(error);
      });
  }

  /**
   * HTTP REQ HANDLE
   */

  private addFilesToGallery(data: Gallery[]) {
    this.galleryService.insertManyGallery(data)
      .subscribe(res => {
        // this.spinnerService.hide();
        this.reloadService.needRefreshData$();
        this.dialogRef.close();
      }, error => {
        // this.spinnerService.hide();
        console.log(error);
      });
  }


}
