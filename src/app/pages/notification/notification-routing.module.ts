import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllNotificationComponent} from "./all-notification/all-notification.component";
import {AddNotificationComponent} from "./add-notification/add-notification.component";

const routes: Routes = [
  {path: 'all-notification', component: AllNotificationComponent},
  {path: 'add-notification', component: AddNotificationComponent},
  {path: 'edit-notification/:id', component: AddNotificationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
