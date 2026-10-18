import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectToggleService } from 'src/app/services/common/select-toggle.service';
import { ReloadService } from 'src/app/services/core/reload.service';

@Component({
  selector: 'app-general-dropdown',
  templateUrl: './general-dropdown.component.html',
  styleUrls: ['./general-dropdown.component.scss'],
})
export class GeneralDropdownComponent implements OnInit {
  //DECORATOR
  @Input() inputData: any = null;
  @Input() placeHolderId: string = null;
  @Input() isSearch: boolean = true;
  @Input() label: string = null;
  @Input() patchedValue: any = null;
  @Input() isDisabled: boolean = false;
  @Input() isRequired: boolean = true;
  @Input() placeHolderName: string = null;

  @Output() passDataEvent = new EventEmitter();

  //store variables
  dataSelected: any = null;
  errorMsg: boolean = false;
  isSelectShow = '';

  constructor(
    private _selectToggle: SelectToggleService,
    private reloadService: ReloadService
  ) {
    this._selectToggle.selectToggle.subscribe((res) => {
      this.isSelectShow = res;
    });
  }

  ngOnInit(): void {
    this.reloadService.refreshSelectData$.subscribe((res) => {
      if (res) {
        this.dataSelected = res;
      }
    });
  }

  ngOnChanges(): void {
    if (this.placeHolderId) {
      this.getSelectedDataById();
    }
  }

  getSelectedDataById() {
    this.dataSelected = this.inputData?.find(
      (data: any) => data.id === this.placeHolderId
    );

    // this.passDataEvent.emit(this.dataSelected);
  }

  /**
   * getSelectedDataById()
   * dataErrorShow()
   * dataErrorHide()
   * isSelectToggle(showType: String)
   * isSelectClose()
   * onSelectData(data: any)
   */

  dataErrorShow() {
    this.errorMsg = true;
  }

  dataErrorHide() {
    this.errorMsg = false;
  }

  isSelectToggle(showType: String) {
    if (this.isSelectShow !== showType) {
      this.isSelectShow = showType.toLowerCase();
      this.searchQuery = undefined;
      this._selectToggle.selectCountryToggle.next('');
    } else {
      if (this.dataSelected === undefined) {
        this.dataErrorShow();
      }
      this.isSelectShow = '';
    }
  }

  isSelectClose() {
    this.isSelectShow = '';
  }

  onSelectData(data: any) {
    this.dataSelected = data;
    this.passDataEvent.emit(this.dataSelected);
    this.dataErrorHide();
    this.isSelectClose();
  }

  searchQuery: any;

  //SEARCH MENU
  searchMenu(input: HTMLInputElement) {
    if (input.value.trim() === '') {
      this.searchQuery = undefined;
    } else {
      this.searchQuery = input.value.toLowerCase();
    }
  }
}
