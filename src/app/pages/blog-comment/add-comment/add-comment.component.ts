import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Comment} from "../../../interfaces/common/comment.interface";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CommentService} from "../../../services/common/comment.service";
import {Select} from "../../../interfaces/core/select";
import {UtilsService} from "../../../services/core/utils.service";
import {StorageService} from "../../../services/core/storage.service";

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  private sub: Subscription;

  isLoading: any;

  // Store Data from param
  id?: string;
  comment: Comment = null;

  commentStatus: Select[] = [
    {value: false, viewValue: 'Not Approve'},
    {value: true, viewValue: 'Approve'},
  ];

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private utilsService: UtilsService,
    private storageService: StorageService,
    private commentService: CommentService,
  ) {
  }

  ngOnInit(): void {

    this.dataForm = this.fb.group({
      status: [null, Validators.required],
      reply: [null],
      isComment: [null],
    });

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getCommentByCommentId();
      }
    });

  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue({status: this.comment.status, reply: this.comment.reply, isComment: this.comment.isComment});
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field');
      return;
    }
    const finalData = {
      ...this.dataForm.value,
      ...{
        _id: this.comment._id,
        replyDate: this.utilsService.getDateString(new Date()),
        // rating: this.comment?.rating,
        blog: this.comment.blog,

      }
    };

    this.editComment(finalData);

  }


  /**
   * HTTP REQ
   */

  private getCommentByCommentId() {
    this.commentService.getCommentByCommentId(this.id)
      .subscribe(res => {
        this.comment = res.data;
        this.setFormData();
      }, error => {
        console.log(error);
      });
  }

  private editComment(data: Comment) {

    this.commentService.editComment(data)
      .subscribe(res => {
        this.uiService.success(res.message);
      }, error => {
        console.log(error);
      });
  }

}
