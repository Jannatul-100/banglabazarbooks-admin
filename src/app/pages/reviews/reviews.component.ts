import {Component, OnInit} from '@angular/core';
import {ConfirmDialogComponent} from '../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../services/core/ui.service';
import {Review} from '../../interfaces/common/review.interface';
import {ReviewService} from '../../services/common/review.service';
import {ReloadService} from '../../services/core/reload.service';
import {Select} from "../../interfaces/core/select";
import {UtilsService} from "../../services/core/utils.service";

// @ts-ignore
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  allReviews: Review[] = [];
  reviewData: Review;
  reviewId: string;
  reviewStatus: Select[] = [
    { value: false, viewValue: 'Not Approve' },
    { value: true, viewValue: 'Approve' },
  ];

  // Initial status
  selectedStatus: boolean = false;

  constructor(
    private dialog: MatDialog,
    private reviewService: ReviewService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private reloadService: ReloadService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshData$
      .subscribe(() => {
        this.getAllReviews();
      });
    this.getAllReviews();
  }

  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(data?: string) {
    this.reviewId = data;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.getAllReviews();
        // this.updateReviewAndDelete();
      }
    });
  }

  // openComponentDialog(product: string) {
  //
  // }

  /**
   * HTTP REQ HANDLE
   */

  private getAllReviews() {
    this.reviewService.getAllReviews()
      .subscribe(res => {
        this.allReviews = res.data;

        this.reviewData = this.allReviews.find(m => m._id === this.reviewId)

        if (this.reviewData) {

          this.updateReviewAndDelete()
        }
      }, error => {
        console.log(error);
      });
  }


  private updateReviewAndDelete() {

    this.reviewService.updateReviewAndDelete(this.reviewData)
      .subscribe(res => {
        // this.uiService.success(res.message);
        this.deleteReviewByReviewId()
      }, error => {
        console.log(error);
      });
  }

  /**
   * DELETE METHOD HERE
   */
  private deleteReviewByReviewId() {
    this.reviewService.deleteReviewByReviewId(this.reviewId)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshData$();
      }, error => {
        console.log(error);
      });
  }

  /**
   * Updates the status when the toggle changes.
   */
  onStatusChange(event: any, data: any): void {
    const updatedStatus = event.checked;
    const finalData = {
      _id: data._id,
      status: updatedStatus,
      replyDate: this.utilsService.getDateString(new Date()),
      rating: data.rating,
      product: data.product,
    };

    this.editReview(finalData);
  }

  /**
   * Sends the edited review data to the backend.
   */
  private editReview(data: any): void {
    this.reviewService.editReview(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshData$();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  /**
   * Retrieves the label for the current status.
   */
  getStatusLabel(status: boolean): string {
    const foundStatus = this.reviewStatus.find((item) => item.value === status);
    return foundStatus ? foundStatus.viewValue : '';
  }
}
