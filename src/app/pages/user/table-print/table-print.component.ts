import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-table-print',
  templateUrl: './table-print.component.html',
  styleUrls: ['./table-print.component.scss']
})
export class TablePrintComponent implements OnInit {
@Input() products:any;

  myDate = new Date();
  constructor() { }

  ngOnInit(): void {
  }

}
