import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllPopupComponent} from "../customization/popup/all-popup/all-popup.component";
import {AddPopupComponent} from "../customization/popup/add-popup/add-popup.component";

const routes: Routes = [
  { path: 'all-popup', component: AllPopupComponent },
  { path: 'add-popup', component: AddPopupComponent},
  { path: 'edit-popup/:id', component: AddPopupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManuscriptSubjectRoutingModule { }
