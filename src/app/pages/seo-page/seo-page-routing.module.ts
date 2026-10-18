import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllSeoPageComponent} from './seo-page/all-seo-page/all-seo-page.component';
import {AddSeoPageComponent} from './seo-page/add-seo-page/add-seo-page.component';
import {AllRedirectUrlComponent} from "./seo-page/all-redirect-url/all-redirect-url.component";
import {AddRedirectUrlComponent} from "./seo-page/add-redirect-url/add-redirect-url.component";

const routes: Routes = [
  {path: 'all-seo-page', component: AllSeoPageComponent},
  {path: 'add-seo-page', component: AddSeoPageComponent},
  {path: 'edit-seo-page/:id', component: AddSeoPageComponent},
  {path: 'all-redirect-url', component: AllRedirectUrlComponent},
  {path: 'add-redirect-url', component: AddRedirectUrlComponent},
  {path: 'edit-redirect-url/:id', component: AddRedirectUrlComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeoPageRoutingModule { }
