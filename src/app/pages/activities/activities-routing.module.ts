import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllActivitiesComponent} from "./all-activities/all-activities.component";
import {AddActivitiesComponent} from "./add-activities/add-activities.component";

const routes: Routes = [
  {path: 'all-activities', component: AllActivitiesComponent},
  {path: 'add-activities', component: AddActivitiesComponent},
  {path: 'edit-activities/:id', component: AddActivitiesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivitiesRoutingModule { }
