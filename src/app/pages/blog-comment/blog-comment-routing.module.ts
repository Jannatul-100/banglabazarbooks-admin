import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllCommentComponent} from "./all-comment/all-comment.component";
import {AddCommentComponent} from "./add-comment/add-comment.component";

const routes: Routes = [
  {path: 'all-comment', component: AllCommentComponent},
  {path: 'add-comment', component: AddCommentComponent},
  {path: 'edit-comment/:id', component: AddCommentComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogCommentRoutingModule { }
