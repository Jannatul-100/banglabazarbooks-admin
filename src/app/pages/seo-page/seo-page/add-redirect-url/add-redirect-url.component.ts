import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {RedirectUrl} from "../../../../interfaces/common/redirect-url.interface";
import {Subscription} from "rxjs";
import {UiService} from "../../../../services/core/ui.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";
import {RedirectUrlService} from "../../../../services/common/redirect-url.service";

@Component({
  selector: 'app-add-redirect-url',
  templateUrl: './add-redirect-url.component.html',
  styleUrls: ['./add-redirect-url.component.scss']
})
export class AddRedirectUrlComponent implements OnInit {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  id?: string;
  redirectUrl?: RedirectUrl;


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
    private redirectUrlService: RedirectUrlService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getRedirectUrlById();
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
      fromUrl: [null],
      toUrl: [null],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.redirectUrl);
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      console.log(this.dataForm.errors);
      this.uiService.warn('Please filed all the required field');
      return;
    }
    if (!this.redirectUrl) {
      this.addRedirectUrl()
    } else {
      this.updateRedirectUrlById()
    }
  }

  /**
   * HTTP REQ HANDLE
   * getRedirectUrlById()
   * addRedirectUrl()
   * updateRedirectUrlById()
   * removeSingleFile()
   */

  private getRedirectUrlById() {
    this.spinnerService.show();
    this.subDataOne = this.redirectUrlService.getRedirectUrlById(this.id).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.data) {
          this.redirectUrl = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        console.log(error);
      },
    });
  }

  private addRedirectUrl() {
    this.spinnerService.show();
    this.subDataTwo = this.redirectUrlService
      .addRedirectUrl(this.dataForm.value)
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

  private updateRedirectUrlById() {
    this.spinnerService.show();
    this.subDataThree = this.redirectUrlService
      .updateRedirectUrlById(this.redirectUrl._id, this.dataForm.value)
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
  }
}
