import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllVideoComponent} from "./all-video/all-video.component";
import {AddVideoComponent} from "./add-video/add-video.component";

const routes: Routes = [
  { path: 'all-video', component: AllVideoComponent },
  { path: 'add-video', component: AddVideoComponent },
  { path: 'edit-video/:id', component: AddVideoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YoutubeVideoRoutingModule { }
