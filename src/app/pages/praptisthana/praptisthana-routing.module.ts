import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllPraptisthanaComponent} from "./all-praptisthana/all-praptisthana.component";
import {AddPraptisthanaComponent} from "./add-praptisthana/add-praptisthana.component";

const routes: Routes = [
  { path: 'all-praptisthana', component: AllPraptisthanaComponent },
  { path: 'add-praptisthana', component: AddPraptisthanaComponent},
  { path: 'edit-praptisthana/:id', component: AddPraptisthanaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PraptisthanaRoutingModule { }
