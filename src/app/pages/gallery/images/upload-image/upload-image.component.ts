import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {GalleryService} from '../../../../services/gallery/gallery.service';
import {UiService} from '../../../../services/core/ui.service';
import {FileFolder} from '../../../../interfaces/gallery/file-folder.interface';
import {Gallery} from '../../../../interfaces/gallery/gallery.interface';
import {UtilsService} from '../../../../services/core/utils.service';
import {FileUploadService} from '../../../../services/gallery/file-upload.service';
import {ReloadService} from '../../../../services/core/reload.service';
import {ImageConvertOption} from '../../../../interfaces/gallery/image-convert-option.interface';
import {FileTypes} from '../../../../enum/file-types.enum';
import {MatDialog} from '@angular/material/dialog';
import {AddFolderComponent} from '../../folder/add-folder/add-folder.component';
import {FileFolderService} from '../../../../services/gallery/file-folder.service';


@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {

  // in app.component.ts
  files: File[] = [];
  folders: FileFolder[] = [];
  selectedFolder: string = 'Default';
  isCheckConvert: boolean = true;
  quality: string = '85';
  width: string = '1920';
  height: string = null;


  constructor(
    private fileUploadService: FileUploadService,
    private galleryService: GalleryService,
    private utilsService: UtilsService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private dialog: MatDialog,
    private fileFolderService: FileFolderService,
    public dialogRef: MatDialogRef<UploadImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileFolder[],
  ) {
  }

  ngOnInit(): void {
    if (this.data) {
      this.folders = this.data;
    }
  }

  openAddNewFolderDialog() {
    const dialogRef = this.dialog.open(AddFolderComponent, {
      panelClass: ['theme-dialog'],
      width: '95%',
      maxWidth: '480px',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.fileFolderService.getAllFileFolders({
          pagination: null,
          filter: null,
          select: { name: 1 },
          sort: { createdAt: -1 }
        }).subscribe(res => {
          if (res.success) {
            this.folders = res.data;
          }
        });
      }
    });
  }

  /**
   * IMAGE DRUG & DROP
   */
  onSelect(event: { addedFiles: any; }) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }


  /**
   * ON IMAGE UPLOAD
   */
  onUploadImages() {
    if (!this.selectedFolder) {
      this.uiService.warn('No Folder name found!');
      return;
    }
    if (!this.files || this.files.length <= 0) {
      this.uiService.warn('No Image selected!');
      return;
    }
    // this.spinnerService.show();

    const option: ImageConvertOption = {
      convert: this.isCheckConvert ? 'yes' : 'no',
      quality: this.quality,
      width: this.width,
      height: this.height,
    };

    this.fileUploadService.uploadMultiImageOriginalV2(this.files, option)
      .subscribe({
        next: (res) => {
          const data: Gallery[] = res.map(m => {
            return {
              url: m.url,
              name: m.name,
              size: m.size,
              folder: this.selectedFolder,
              type: FileTypes.IMAGE
            } as Gallery;
          });

          this.addImagesToGallery(data);

        }, error: (error) => {
          // this.spinnerService.hide();
          console.log(error);
        }
      });
  }

  /**
   * HTTP REQ HANDLE
   */

  private addImagesToGallery(data: Gallery[]) {
    this.galleryService.insertManyGallery(data)
      .subscribe({
        next: (res) => {
          // this.spinnerService.hide();
          this.reloadService.needRefreshData$();
          this.dialogRef.close();
        }, error: (error) => {
          // this.spinnerService.hide();
          console.log(error);
        }
      });
  }


}
