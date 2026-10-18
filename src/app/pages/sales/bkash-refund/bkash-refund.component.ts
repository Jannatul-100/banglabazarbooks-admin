import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UiService } from '../../../services/core/ui.service';

@Component({
  selector: 'app-bkash-refund',
  templateUrl: './bkash-refund.component.html',
  styleUrls: ['./bkash-refund.component.scss']
})
export class BkashRefundComponent implements OnInit {
  refundForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.refundForm = this.fb.group({
      paymentID: ['', Validators.required],
      trxID: ['', Validators.required],
      amount: ['', Validators.required],
      sku: ['', Validators.required],
      reason: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.refundForm.invalid) {
      this.uiService.warn('Please fill all the required fields');
      return;
    }

    this.isLoading = true;
    const body = this.refundForm.value;

    this.http.post<{ success: boolean; message: string; data: any }>(`${environment.apiBaseLink}/api/payment/refund-bkash-payment`, body)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.uiService.success(res.message);
            this.refundForm.reset();
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
          this.uiService.wrong('Something went wrong. Please try again later.');
        }
      });
  }
}
