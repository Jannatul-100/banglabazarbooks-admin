import {Component, OnInit, ViewChild} from '@angular/core';
import {FilterData} from '../../../interfaces/gallery/filter-data';
import {UiService} from '../../../services/core/ui.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ReloadService} from '../../../services/core/reload.service';
import {EMPTY, Subscription} from 'rxjs';
import {Users} from '../../../interfaces/common/users.interface';
import {UsersService} from '../../../services/common/users.service';
import {AdminPermissions} from 'src/app/enum/admin-permission.enum';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {UtilsService} from '../../../services/core/utils.service';
import {ConfirmDialogComponent} from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {debounceTime, distinctUntilChanged, pluck, switchMap,} from 'rxjs/operators';
import {Pagination} from '../../../interfaces/core/pagination';
import {NgxSpinnerService} from 'ngx-spinner';
import {FileUploadService} from 'src/app/services/gallery/file-upload.service';
import {AdminService} from '../../../services/admin/admin.service';
import * as XLSX from "xlsx";
import {Select} from "../../../interfaces/core/select";
import {Gender_Type, PAYMENT_TYPES} from "../../../core/utils/app-data";
import {DashboardService} from "../../../services/common/dashboard.service";
import {OrderDashboard} from "../../../interfaces/common/dashboard.interface";
import {PdfService} from "../../../services/common/pdf.service";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DivisionService} from "../../../services/common/division.service";
import {Division} from "../../../interfaces/common/division.interface";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];
  selectedPagination = 0;
  genderTypes: Select[] = Gender_Type;
  // Store Data
  toggleMenu: boolean = false;
  holdPrevData: Users[] = [];
  users: Users[] = [];
  usersData: Users[] = [];
  usersCount = 0;
  id?: string;
  isLoading: boolean = true;
  saleData: any;
  // Selected Data
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;
  // Store Data
  divisions: Division[] = [];
  // Date
  today = new Date();
  dataFormDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  // Search Area
  @ViewChild('searchForm') searchForm: NgForm;
  searchQuery = null;
  searchUsers: Users[] = [];

  // Pagination
  currentPage = 1;
  totalUnit = 0;
  UsersPerPage = 10;
  totalUsersStore = 0;

  // FilterData
  filter: any = null;
  sortQuery: any = null;
  activeFilter1: number = null;
  activeFilter2: number = null;
  activeFilter6: number = null;
  activeFilter7: number = null;
  activeSort: number;
  number = [{num: '10'}, {num: '25'}, {num: '50'}, {num: '100'}];
  orderDashboard: OrderDashboard = null;
  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subRouteOne: Subscription;
  private subForm: Subscription;
  private subReload: Subscription;

  constructor(
    private adminService: AdminService,
    private usersService: UsersService,
    private uiService: UiService,
    private router: Router,
    public dashboardService: DashboardService,
    private reloadService: ReloadService,
    private utilsService: UtilsService,
    private fileUploadService: FileUploadService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private divisionService: DivisionService,
    private pdfService: PdfService
  ) {
  }


  ngOnInit(): void {
    // Reload Data
    this.subReload = this.reloadService.refreshBrand$.subscribe(() => {
      this.getAllUserss();
    });

    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
      } else {
        this.currentPage = 1;
      }
      this.getAllUserss();
    });
    this.getAllDivisions();
    // Base Data
    this.getAdminBaseData();
    this.getOrderDashboard();
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
            this.searchUsers = [];
            this.users = this.holdPrevData;
            this.totalUnit = this.totalUsersStore;
            this.searchQuery = null;
            return EMPTY;
          }
          const pagination: Pagination = {
            pageSize: Number(this.UsersPerPage),
            currentPage: Number(this.currentPage) - 1,
          };

          // Select
          const mSelect = {
            name: 1,
            phone: 1,
            email: 1,
            description: 1,
            image: 1,
            profileImg: 1,
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: this.filter,
            select: mSelect,
            sort: {createdAt: -1},
          };

          return this.usersService.getAllUsers(filterData, this.searchQuery);
        })
      )
      .subscribe({
        next: (res) => {
          this.searchUsers = res.data;
          this.users = this.searchUsers;
          this.totalUnit = res.count;
          this.currentPage = 1;
          this.router.navigate([], {queryParams: {page: this.currentPage}});
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  generatePDF() {
    const mSelect = {
      name: 1,
      phone: 1,
      phoneNo: 1,
      email: 1,
      gender: 1,
      image: 1,
      profileImg: 1,
      createdAt: 1,
    };

    const filter: FilterData = {
      filter: this.filter,
      pagination: null,
      select: mSelect,
      sort: this.sortQuery,
    };
    this.usersService.getAllUsers(filter, null).subscribe({
      next: (res) => {
        if (res.success) {
           const userData = res.data.map(user => [user.name, user.phoneNo]);
            // userData.unshift(['Name', 'Phone Number']); // Adding header row
          this.pdfService.generatePdf(userData, 'user_data.pdf');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });

  }


  private getAllDivisions() {


    // Select
    const mSelect = {
      name: 1,
      priority: 1,
      status: 1,
      createdAt: 1,
    }

    const filterData: FilterData = {
      pagination: {
        pageSize: Number(this.UsersPerPage),
        currentPage: Number(this.currentPage) - 1,
      },
      filter: null,
      select: mSelect,
      sort: this.sortQuery
    }


    this.subDataOne = this.divisionService.getAllDivisions(filterData, this.searchQuery)
      .subscribe({
        next: (res => {
          this.divisions = res.data;
        }),
        error: (error => {
          console.log(error);
        })
      });
  }

  /**
   * CHECK ADMIN PERMISSION
   * getAdminBaseData()
   * checkAddPermission()
   * checkDeletePermission()
   * checkEditPermission()
   */
  getOrderDashboard() {
    this.subDataOne = this.dashboardService.getOrderDashboard()
      .subscribe({
        next: (res) => {
          this.orderDashboard = res.data;

        },
        error: (err) => {
          console.log(err)
        }
      })
  }

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
   *  Pagination
   * onPageChanged()
   */

  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }
  public SelectChange(data: any) {
    this.UsersPerPage = data;
    this.selectedPagination = data;
    this.getAllUserss();
  }

  /**
   * HTTP REQ HANDLE
   * getAllUsers()
   * deleteMultipleUsersById()
   */

  private getAllUserss() {
    // Spinner..
    this.spinner.show();
    const filter: FilterData = {
      filter: this.filter,
      pagination: null,
      select: {
        name: 1,
        phone: 1,
        phoneNo: 1,
        addresses: 1,
        division: 1,
        email: 1,
        gender: 1,
        image: 1,
        profileImg: 1,
        createdAt: 1,
      },
      sort: {createdAt: -1},
    };

    this.subDataOne = this.usersService.getAllUsers(filter, null).subscribe({
      next: (res) => {
        if (res.success) {

          this.users = res.data;
          this.usersCount = res.count;
          this.holdPrevData = this.users;
          this.totalUsersStore = this.usersCount;
          // Spinner..
          this.isLoading = false;
          this.spinner.hide();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  endChangeRegDateRange(event: MatDatepickerInputEvent<any>) {
    if (event.value) {
      const startDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.start
      );
      const endDate = this.utilsService.getNextDateString(
        this.dataFormDateRange.value.end,
        1
      );

      const qData = { birthDate: { $gte: startDate, $lte: endDate } };
      this.filter = { ...this.filter, ...qData };


      if (this.currentPage > 1) {
        this.router.navigate([], { queryParams: { page: 1 } });
      } else {
        this.getAllUserss();
      }
    }
  }

  private deleteMultipleUsersById() {
    this.subDataTwo = this.usersService
      .deleteMultipleUserById(this.selectedIds)
      .subscribe({
        next: (res) => {
          if (res.success) {
            // Get Data array
            const selectedUsers = [];
            this.selectedIds.forEach((id) => {
              const fData = this.users.find((data) => data._id === id);
              if (fData) {
                selectedUsers.push(fData);
              }
            });

            this.selectedIds = [];
            this.uiService.success(res.message);

            // fetch Data

            if (this.currentPage > 1) {
              this.router.navigate([], {queryParams: {page: 1}});
            } else {
              this.getAllUserss();
            }
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
  }


  /**
   * ON Select Check
   * onCheckChange()
   * onAllSelectChange()
   * onRemoveAllQuery()
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
    const currentPageIds = this.users.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.users.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.users.find((f) => f._id === m).select = false;
        const i = this.selectedIds.findIndex((f) => f === m);
        this.selectedIds.splice(i, 1);
      });
    }
  }

  onRemoveAllQuery() {
    this.activeSort = null;
    this.activeFilter1 = null;
    this.activeFilter2 = null;
    this.activeFilter6 = null;
    this.activeFilter7 = null;
    this.sortQuery = {createdAt: -1};
    this.filter = null;
    this.dataFormDateRange.reset();
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllUserss();
    }
  }


  /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
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
            this.deleteMultipleUsersById();
          }
        });
        break;
      }

      case 'print': {
        this.saleData = this.users;
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: '400px',
          data: {
            title: 'Confirm Print',
          },
        });
        dialogRef.afterClosed().subscribe((dialogResult) => {
          if (dialogResult) {
            window.print();
            window.close();
          }
        });
        break;
      }
      default: {
        break;
      }
    }
  }


  /**
   * FILTERING
   */
  filterData(value: any, index: number, type: string) {
    switch (type) {
      case 'gender': {
        this.filter = { ...this.filter, ...{ gender: value } };
        this.activeFilter6 = index;
        break;
      }
      case 'address': {
        this.filter = { ...this.filter, ...{ 'division.name': value } };
        this.activeFilter7 = index;
        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data

    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } });
    } else {
      this.getAllUserss();
    }
  }

  /**
   * Sorting
   * sortData()
   */

  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllUserss();
  }


  /**
   * EXPORTS TO EXCEL
   * exportToExcel()
   */


  exportToAllExcel() {
    // let dataArray:any[] = [];
    const date = this.utilsService.getDateString(new Date());
    if (this.selectedIds.length) {
      const dataArray = [];
      this.selectedIds.forEach(id => {
        const data = this.users.find(f => f._id === id);
        dataArray.push(data);
      })
      console.log('dataArray',dataArray)
      const mData = dataArray.map((m) => {
        return {
          'Customer Name': m?.name ?? '-',
          'Customer Email': m?.email ?? '-',
          'Customer Phone No': m?.phoneNo ?? '-',
          'Customer Gender': m?.gender ?? '-',
          'Created Date': this.utilsService.getDateString(m?.createdAt),
        };
      });

      // EXPORT XLSX
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `Transaction_Orders_${date}.xlsx`);

    } else {
      // Select
      const mSelect = {
        name: 1,
        phone: 1,
        phoneNo: 1,
        email: 1,
        gender: 1,
        image: 1,
        profileImg: 1,
        createdAt: 1,
      };

      const filter: FilterData = {
        filter: this.filter,
        pagination: null,
        select: mSelect,
        sort: this.sortQuery,
      };

      this.usersService.getAllUsers(filter, null).subscribe({
        next: (res) => {
          if (res.success) {
            console.log('res',res.data);
            const mData = res.data.map((m) => {
              return {
                'Customer Name': m?.name ?? '-',
                'Customer Email': m?.email ?? '-',
                'Customer Phone No': m?.phoneNo ?? '-',
                'Customer Gender': m?.gender ?? '-',
                'Created Date': this.utilsService.getDateString(m?.createdAt),
              };
            });

            // EXPORT XLSX
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Data');
            XLSX.writeFile(wb, `Transaction_Orders_${date}.xlsx`);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
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
