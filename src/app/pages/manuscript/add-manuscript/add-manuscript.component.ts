import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Manuscript } from 'src/app/interfaces/common/manuscript.interface';
import { ManuscriptService } from 'src/app/services/common/manuscript.service';
import { UiService } from 'src/app/services/core/ui.service';
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {ReloadService} from "../../../services/core/reload.service";
import {MatDialog} from "@angular/material/dialog";

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
manuscript?: Manuscript;

// Image Upload
files: File[] = [];
pickedImage: any[] = [];
oldImage: string[] = [];


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
  private reloadService: ReloadService,
  private dialog: MatDialog,
  private manuscriptService: ManuscriptService,
) {
}


ngOnInit(): void {
  // Init Form
  this.initDataForm();

  // GET ID FORM PARAM
  this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
    this.id = param.get('id');

    if (this.id) {
      this.getManuscriptById();
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
    birthDayDate: [null],
    profession: [null],
    phone: [null],
    email: [null],
    address: [null],
    docFile: [null],
    manuScriptName: [null],
    manuScriptWords: [null],
    manuScriptContents: [null],
    targrtReaderClasses: [null],
    manuScriptSummery: [null],
    manuScriptComment: [null],
    manuScriptLink: [null]
  });
}

private setFormValue() {
  this.dataForm.patchValue(this.manuscript);
  if (this.manuscript && this.manuscript.email) {
    this.oldImage.push(this.manuscript.email);
  }
}

onSubmit() {

  if (this.dataForm.invalid) {
    this.uiService.warn('Please filed all the required field');
    return;
  }
  if (this.manuscript) {

    this.updateManuscriptById();

  } else {
    this.addManuscript();

  }
}

/**
 * HTTP REQ HANDLE
 * getManuscriptById()
 * addManuscript()
 * updateManuscriptById()
 * removeSingleFile()
 */

private getManuscriptById() {
  this.spinnerService.show();
  this.subDataOne = this.manuscriptService.getManuscriptById(this.id)
    .subscribe({
      next: (res => {
        this.spinnerService.hide();
        if (res.data) {
          this.manuscript = res.data;
          this.setFormValue();
        }
      }),
      error: (error => {
        this.spinnerService.hide();
        console.log(error);
      })
    });
}

private addManuscript() {
  this.spinnerService.show();
  this.subDataTwo = this.manuscriptService.addManuscript(this.dataForm.value)
    .subscribe({
      next: (res => {
        this.spinnerService.hide();
        if (res.success) {
          this.uiService.success(res.message);
          this.formElement.resetForm();

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

private updateManuscriptById() {
  this.spinnerService.show();
  this.subDataThree = this.manuscriptService.updateManuscriptById(this.manuscript._id, this.dataForm.value)
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
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
   */
  public openPrintDialog(type: string) {
    switch (type) {
      case 'print': {
        // this.saleData = data;
        this.reloadService.needRefreshSideNav$()
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: '400px',
          data: {
            title: 'Confirm Print',
          },
        });
        dialogRef.afterClosed().subscribe((dialogResult) => {
          if (dialogResult) {
            window.print();
            window.close();
          }
        });
        break;
      }
      default: {
        break;
      }
    }
  }
/**
 * IMAGE UPLOAD
 * onSelect()
 * onRemove()
 */

onSelect(event: { addedFiles: any; }) {
  this.files.push(...event.addedFiles);
}

onRemove(event: File) {
  this.files.splice(this.files.indexOf(event), 1);
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
