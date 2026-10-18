import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllActivitiesCommentComponent} from "./all-activities-comment/all-activities-comment.component";
import {AddActivitiesCommentComponent} from "./add-activities-comment/add-activities-comment.component";

const routes: Routes = [
  {path: 'all-activities-comment', component: AllActivitiesCommentComponent},
  {path: 'add-activities-comment', component: AddActivitiesCommentComponent},
  {path: 'edit-activities-comment/:id', component: AddActivitiesCommentComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivitiesCommentRoutingModule { }
