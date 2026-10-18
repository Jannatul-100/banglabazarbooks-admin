import {Component, OnInit} from '@angular/core';
import {Comment} from "../../../interfaces/common/comment.interface";
import {CommentService} from "../../../services/common/comment.service";
import {UiService} from "../../../services/core/ui.service";
import {MatDialog} from "@angular/material/dialog";
import {ReloadService} from "../../../services/core/reload.service";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";


@Component({
  selector: 'app-all-comment',
  templateUrl: './all-comment.component.html',
  styleUrls: ['./all-comment.component.scss']
})
export class AllCommentComponent implements OnInit {
  allComments: Comment[] = [];
  commentData: Comment;
  commentId: string;

  constructor(
    private dialog: MatDialog,
    private commentService: CommentService,
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
    this.commentService.getAllComments()
      .subscribe(res => {
        this.allComments = res.data;

        this.commentData = this.allComments.find(m => m._id === this.commentId)
        console.log("idddd+++", this.allComments)
        console.log("commentDat+++a", this.commentData)


        if (this.commentData) {

          this.updateCommentAndDelete()
        }
      }, error => {
        console.log(error);
      });
  }


  private updateCommentAndDelete() {
    console.log("hhhh")
    console.log("idddd", this.commentId)
    console.log("commentData", this.commentData)
    this.commentService.updateCommentAndDelete(this.commentData)
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
    this.commentService.deleteCommentByCommentId(this.commentId)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshData$();
      }, error => {
        console.log(error);
      });
  }
}
