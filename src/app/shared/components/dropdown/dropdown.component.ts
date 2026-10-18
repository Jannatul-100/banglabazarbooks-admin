import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Dropdown} from "./interfaces/dropdown.interface";

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  dropdownOpen = false;
  selectedOption: string | null = null;


  @Input() options: Dropdown[] = [];
  @Input() iconName: string = 'title';
  @Input() minDropdownWidth = '200px';
  @Output() onChange = new EventEmitter();


  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    console.log('this.dropdownOpen', this.dropdownOpen)
  }

  selectOption($event: MouseEvent, option: Dropdown) {
    $event.stopPropagation();
    this.selectedOption = option.viewValue;
    this.dropdownOpen = false;
    this.onChange.emit(option.value);
  }

  onOutsideClick() {
    this.dropdownOpen = false;
  }
}
