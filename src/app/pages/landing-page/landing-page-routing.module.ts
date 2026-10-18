import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllLandingPageComponent } from './all-landing-page/all-landing-page.component';
import { AddLandingPageComponent } from './add-landing-page/add-landing-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'all-landing-page', pathMatch: 'full' },
  { path: 'all-landing-page', component: AllLandingPageComponent },
  { path: 'add-landing-page', component: AddLandingPageComponent },
  {
    path: 'add-landing-page-2',
    component: AddLandingPageComponent,
    data: { template: 'v2' },
  },
  { path: 'edit-landing-page/:id', component: AddLandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule {}
