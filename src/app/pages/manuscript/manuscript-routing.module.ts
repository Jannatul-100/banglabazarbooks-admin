import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddManuscriptComponent } from './add-manuscript/add-manuscript.component';
import { AllManuscriptComponent } from './all-manuscript/all-manuscript.component';

const routes: Routes = [
  {path: 'all-manuscript', component: AllManuscriptComponent},
  {path: 'add-manuscript', component: AddManuscriptComponent},
  {path: 'edit-manuscript/:id', component: AddManuscriptComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManuscriptRoutingModule { }
