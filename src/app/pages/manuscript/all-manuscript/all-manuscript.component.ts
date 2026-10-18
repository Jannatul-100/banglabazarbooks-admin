import {Component, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, pluck, debounceTime, distinctUntilChanged, switchMap, EMPTY } from 'rxjs';
import { AdminPermissions } from 'src/app/enum/admin-permission.enum';
import { Manuscript } from 'src/app/interfaces/common/manuscript.interface';
import { Pagination } from 'src/app/interfaces/core/pagination';
import { FilterData } from 'src/app/interfaces/gallery/filter-data';
import { AdminService } from 'src/app/services/admin/admin.service';
import { ManuscriptService } from 'src/app/services/common/manuscript.service';
import { ReloadService } from 'src/app/services/core/reload.service';
import { UiService } from 'src/app/services/core/ui.service';
import { UtilsService } from 'src/app/services/core/utils.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';
import * as jsPDF from "jspdf";
import html2canvas from "html2canvas";

@Component({
  selector: 'app-all-manuscript',
  templateUrl: './all-manuscript.component.html',
  styleUrls: ['./all-manuscript.component.scss']
})
export class AllManuscriptComponent implements OnInit,OnDestroy {

 // Admin Base Data
 adminId: string;
 role: string;
 permissions: AdminPermissions[];
 selectedPagination = 0;
 // Store Data
 toggleMenu: boolean = false;
 manuscripts: Manuscript[] = [];
 holdPrevData: Manuscript[] = [];
 manuscriptCount = 0;
 id?: string;
  userData: any;
 // Selected Data
 selectedIds: string[] = [];
 @ViewChild('matCheckbox') matCheckbox: MatCheckbox;

 // Date
 today = new Date();
 dataFormDateRange = new FormGroup({
   start: new FormControl(),
   end: new FormControl(),
 });

 // Search Area
 @ViewChild('searchForm') searchForm: NgForm;
 searchQuery = null;
 searchManuscript: Manuscript[] = [];

 // Pagination
 currentPage = 1;
 totalManuscripts = 0;
 ManuscriptsPerPage = 10;
 totalManuscriptsStore = 0;

 // FilterData
 filter: any = null;
 sortQuery: any = null;
 activeFilter1: number = null;
 activeFilter2: number = null;
 activeSort: number;
 number = [{num: '10'}, {num: '25'}, {num: '50'}, {num: '100'}];


 // Subscriptions
 private subDataOne: Subscription;
 private subDataTwo: Subscription;
 private subForm: Subscription;
 private subRouteOne: Subscription;
 private subReload: Subscription;

 constructor(
   private adminService: AdminService,
   private manuscriptService: ManuscriptService,
   private uiService: UiService,
   private utilsService: UtilsService,
   private router: Router,
   private dialog: MatDialog,
   private spinner: NgxSpinnerService,
   private renderer: Renderer2,
   private reloadService: ReloadService,
   private activatedRoute: ActivatedRoute,
 ) {
 }

 ngOnInit(): void {
   // Reload Data
   this.subReload = this.reloadService.refreshBrand$.subscribe(() => {
     this.getAllManuscript();
   });

   // GET PAGE FROM QUERY PARAM
   this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((qParam) => {
     if (qParam && qParam.get('page')) {
       this.currentPage = Number(qParam.get('page'));
     } else {
       this.currentPage = 1;
     }
     this.getAllManuscript();
   });

   // Base Data
   this.getAdminBaseData();

 }

 ngAfterViewInit(): void {
   const formValue = this.searchForm.valueChanges;

   this.subForm = formValue
     .pipe(
       // map(t => t.searchTerm)
       // filter(() => this.searchForm.valid),
       pluck('searchTerm'),
       debounceTime(200),
       distinctUntilChanged(),
       switchMap((data) => {
         this.searchQuery = data;
         if (this.searchQuery === '' || this.searchQuery === null) {
           this.searchManuscript = [];
           this.manuscripts = this.holdPrevData;
           this.totalManuscripts = this.totalManuscriptsStore;
           this.searchQuery = null;
           return EMPTY;
         }
         const pagination: Pagination = {
           pageSize: Number(this.ManuscriptsPerPage),
           currentPage: Number(this.currentPage) - 1,
         };

         // Select
         const mSelect = {
           name: 1,
           email: 1,
           phone: 1,
           message: 1,
           createdAt: 1,
         };

         const filterData: FilterData = {
           pagination: pagination,
           filter: this.filter,
           select: mSelect,
           sort: {createdAt: -1},
         };

         return this.manuscriptService.getAllManuscript(
           filterData,
           this.searchQuery
         );
       })
     )
     .subscribe({
       next: (res) => {
         this.searchManuscript = res.data;
         this.manuscripts = this.searchManuscript;
         this.totalManuscripts = res.count;
         this.currentPage = 1;
         this.router.navigate([], {queryParams: {page: this.currentPage}});
       },
       error: (error) => {
         console.log(error);
       },
     });
 }


 /**
  * CHECK ADMIN PERMISSION
  * getAdminBaseData()
  * checkAddPermission()
  * checkDeletePermission()
  * checkEditPermission()
  */

 private getAdminBaseData() {
   this.adminId = this.adminService.getAdminId();
   this.role = this.adminService.getAdminRole();
   this.permissions = this.adminService.getAdminPermissions();
 }

 get checkAddPermission(): boolean {
   return this.permissions.includes(AdminPermissions.CREATE);
 }

 get checkDeletePermission(): boolean {
   return this.permissions.includes(AdminPermissions.DELETE);
 }

 get checkEditPermission(): boolean {
   return this.permissions.includes(AdminPermissions.EDIT);
 }


 /**
  * UI Essentials & Pagination
  * onToggle()
  * onPageChanged()
  */
 onToggle() {
   this.toggleMenu = !this.toggleMenu;
 }

 public onPageChanged(event: any) {
   this.router.navigate([], {queryParams: {page: event}});
 }
 public SelectChange(data: any) {
  this.ManuscriptsPerPage = data;
  this.selectedPagination = data;
  this.getAllManuscript();
}

 /**
  * HTTP REQ HANDLE
  * getAllBrands()
  * deleteMultipleManuscriptById()
  * deleteMultipleFile()
  */

 private getAllManuscript() {
   // Select
   const mSelect = {
     name: 1,
     email: 1,
     phone: 1,
     manuScriptName:1,
     manuScriptWords:1,
     manuScriptContents:1,
     targrtReaderClasses:1,
     manuScriptSummery:1,
     manuScriptComment:1,
     manuScriptLink:1,
     createdAt: 1,
     docFile: 1,
   };

   const filter: FilterData = {
     filter: this.filter,
     pagination: null,
     select: mSelect,
     sort: {createdAt: -1},
   };

   this.subDataOne = this.manuscriptService
     .getAllManuscript(filter, null)
     .subscribe({
       next: (res) => {
         if (res.success) {
           this.manuscripts = res.data;
           this.manuscriptCount = res.count;
           this.holdPrevData = this.manuscripts;
           this.totalManuscriptsStore = this.manuscriptCount;
           console.log(this.manuscripts);
         }
       },
       error: (err) => {
         console.log(err);
       },
     });
 }

 private deleteMultipleManuscriptById() {
   this.spinner.show();
   this.subDataTwo = this.manuscriptService
     .deleteMultipleManuscriptById(this.selectedIds)
     .subscribe(
       (res) => {
         this.spinner.hide();
         if (res.success) {
           // Get Data array
           const selectedManuscript = [];
           this.selectedIds.forEach(id => {
             const fData = this.manuscripts.find(data => data._id === id);
             if (fData) {
               selectedManuscript.push(fData);
             }
           });
           this.selectedIds = [];
           this.uiService.success(res.message);
           // fetch Data
           if (this.currentPage > 1) {
             this.router.navigate([], {queryParams: {page: 1}});
           } else {
             this.getAllManuscript();
           }
         } else {
           this.uiService.warn(res.message);
         }
       },
       (error) => {
         this.spinner.hide();
         console.log(error);
       }
     );
 }




 /**
  * ON Select Check
  * onCheckChange()
  * onAllSelectChange()
  */

 onCheckChange(event: any, index: number, id: string) {
   if (event) {
     this.selectedIds.push(id);
   } else {
     const i = this.selectedIds.findIndex((f) => f === id);
     this.selectedIds.splice(i, 1);
   }
 }

 onAllSelectChange(event: MatCheckboxChange) {
   const currentPageIds = this.manuscripts.map((m) => m._id);
   if (event.checked) {
     this.selectedIds = this.utilsService.mergeArrayString(
       this.selectedIds,
       currentPageIds
     );
     this.manuscripts.forEach((m) => {
       m.select = true;
     });
   } else {
     currentPageIds.forEach((m) => {
       this.manuscripts.find((f) => f._id === m).select = false;
       const i = this.selectedIds.findIndex((f) => f === m);
       this.selectedIds.splice(i, 1);
     });
   }
 }


 /**
  *  DATA Sorting
  * sortData()
  * onRemoveAllQuery()
  */

 sortData(query: any, type: number) {
   this.sortQuery = query;
   this.activeSort = type;
   this.getAllManuscript();
 }

 onRemoveAllQuery() {
   this.activeSort = null;
   this.activeFilter1 = null;
   this.activeFilter2 = null;
   this.sortQuery = {createdAt: -1};
   this.filter = null;
   this.dataFormDateRange.reset();
   // Re fetch Data
   if (this.currentPage > 1) {
     this.router.navigate([], {queryParams: {page: 1}});
   } else {
     this.getAllManuscript();
   }
 }


 /**
  * COMPONENT DIALOG VIEW
  */
 public openConfirmDialog(type: string) {
   switch (type) {
     case 'delete': {
       const dialogRef = this.dialog.open(ConfirmDialogComponent, {
         maxWidth: '400px',
         data: {
           title: 'Confirm Delete',
           message: 'Are you sure you want delete this data?',
         },
       });
       dialogRef.afterClosed().subscribe((dialogResult) => {
         if (dialogResult) {
           this.deleteMultipleManuscriptById();
         }
       });
       break;
     }
     default: {
       break;
     }
   }
 }

  async captureHTMLToPDF(data: any) {
    try {
      // Assign the data to userData
      this.userData = data;

      // Wait for a brief moment to ensure data rendering
      await new Promise(resolve => setTimeout(resolve, 500)); // Adjust the delay time as needed

      let elementId;
      // if (this.userData.gender === 'male') {
      //   elementId = 'your-html-element-id';
      // } else {
        elementId = 'your-html-element-id';
      // }

      // Select the HTML element to capture
      const element = document.getElementById(elementId);

      // Check if the element exists
      if (!element) {
        throw new Error('HTML element not found.');
      }

      // Use html2canvas to render the HTML element to a canvas
      const canvas = await html2canvas(element);

      // Convert the canvas to a data URL representing a PNG image
      const imageDataUrl = canvas.toDataURL('image/png');

      // Create a new jsPDF instance
      // @ts-ignore
      const pdf = new jsPDF();

      // Add the captured image to the PDF document
      pdf.addImage(imageDataUrl, 'PNG', 0, 0);

      // Save or open the PDF
      pdf.save(`${this.userData?.userId}.pdf`);
    } catch (error) {
      console.error('Error capturing HTML to PDF:', error);
    }
  }

 /**
  * ON DESTROY
  */

 ngOnDestroy() {
   if (this.subDataOne) {
     this.subDataOne.unsubscribe();
   }

   if (this.subDataTwo) {
     this.subDataTwo.unsubscribe();
   }

   if (this.subRouteOne) {
     this.subRouteOne.unsubscribe();
   }


   if (this.subForm) {
     this.subForm.unsubscribe();
   }
 }
}
