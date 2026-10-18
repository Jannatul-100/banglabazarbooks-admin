import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralDropdownComponent } from './general-dropdown.component';

@NgModule({
  declarations: [GeneralDropdownComponent],
  imports: [
    CommonModule,
  ],
  exports:[GeneralDropdownComponent]
})
export class GeneralDropdownModule { }
