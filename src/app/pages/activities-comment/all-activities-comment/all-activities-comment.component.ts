import {Component, OnInit} from '@angular/core';
import {Comment} from "../../../interfaces/common/comment.interface";
import {MatDialog} from "@angular/material/dialog";
import {UiService} from "../../../services/core/ui.service";
import {ReloadService} from "../../../services/core/reload.service";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {ActivitiesCommentService} from "../../../services/common/activities-comment.service";

@Component({
  selector: 'app-all-activities-comment',
  templateUrl: './all-activities-comment.component.html',
  styleUrls: ['./all-activities-comment.component.scss']
})
export class AllActivitiesCommentComponent implements OnInit {
  allComments: Comment[] = [];
  commentData: Comment;
  commentId: string;

  constructor(
    private dialog: MatDialog,
    private activitiesCommentService: ActivitiesCommentService,
    private uiService: UiService,
    private reloadService: ReloadService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshData$
      .subscribe(() => {
        this.getAllComments();
      });
    this.getAllComments();
  }

  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(data?: string) {
    this.commentId = data;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.getAllComments();
        // this.updateCommentAndDelete();
      }
    });
  }

  // openComponentDialog(product: string) {
  //
  // }

  /**
   * HTTP REQ HANDLE
   */

  private getAllComments() {
    this.activitiesCommentService.getAllComments()
      .subscribe(res => {
        this.allComments = res.data;

        this.commentData = this.allComments.find(m => m._id === this.commentId)


        if (this.commentData) {

          this.updateCommentAndDelete()
        }
      }, error => {
        console.log(error);
      });
  }


  private updateCommentAndDelete() {
    this.activitiesCommentService.updateCommentAndDelete(this.commentData)
      .subscribe(res => {
        // this.uiService.success(res.message);
        this.deleteCommentByCommentId()
      }, error => {
        console.log(error);
      });
  }

  /**
   * DELETE METHOD HERE
   */
  private deleteCommentByCommentId() {
    this.activitiesCommentService.deleteCommentByCommentId(this.commentId)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshData$();
      }, error => {
        console.log(error);
      });
  }
}
