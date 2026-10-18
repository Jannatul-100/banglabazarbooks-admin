import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { UiService } from '../../../../services/core/ui.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReloadService } from '../../../../services/core/reload.service';
import { EMPTY, Subscription } from 'rxjs';
import { FilterData } from '../../../../interfaces/gallery/filter-data';
import { Translator } from '../../../../interfaces/common/translator.interface';
import { TranslatorService } from '../../../../services/common/translator.service';
import { AdminPermissions } from 'src/app/enum/admin-permission.enum';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { UtilsService } from '../../../../services/core/utils.service';
import { debounceTime, distinctUntilChanged, pluck, switchMap } from 'rxjs/operators';
import { Pagination } from '../../../../interfaces/core/pagination';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmDialogComponent } from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import { AdminService } from '../../../../services/admin/admin.service';

@Component({
  selector: 'app-all-translator',
  templateUrl: './all-translator.component.html',
  styleUrls: ['./all-translator.component.scss'],
})
export class AllTranslatorComponent implements OnInit, AfterViewInit, OnDestroy {
  adminId: string;
  role: string;
  permissions: AdminPermissions[] = [];

  translators: Translator[] = [];
  holdPrevData: Translator[] = [];
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;

  @ViewChild('searchForm') searchForm: NgForm;
  searchQuery: string | null = null;

  currentPage = 1;
  totalTranslators = 0;
  translatorsPerPage = 10;
  totalTranslatorsStore = 0;

  filter: any = null;
  sortQuery: any = { createdAt: -1 };
  activeSort: number = 1;

  private subRouteOne: Subscription;
  private subForm: Subscription;
  private subReload: Subscription;

  constructor(
    private adminService: AdminService,
    private translatorService: TranslatorService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private spinnerService: NgxSpinnerService,
    private reloadService: ReloadService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
      } else {
        this.currentPage = 1;
      }
      this.getAllTranslators();
    });

    this.getAdminBaseData();
  }

  ngAfterViewInit(): void {
    const formValue = this.searchForm?.valueChanges;
    if (formValue) {
      this.subForm = formValue
        .pipe(
          pluck('searchTerm'),
          debounceTime(200),
          distinctUntilChanged(),
          switchMap((data) => {
            this.searchQuery = data;
            if (this.searchQuery === '' || this.searchQuery === null) {
              this.translators = this.holdPrevData;
              this.totalTranslators = this.totalTranslatorsStore;
              this.searchQuery = null;
              return EMPTY;
            }
            const pagination: Pagination = {
              pageSize: Number(this.translatorsPerPage),
              currentPage: Number(this.currentPage) - 1,
            };

            const filterData: FilterData = {
              pagination: pagination,
              filter: this.filter,
              select: { name: 1, nameEn: 1, slug: 1, image: 1, priority: 1, createdAt: 1 },
              sort: { createdAt: -1 },
            };

            return this.translatorService.getAllTranslator(filterData, this.searchQuery);
          }),
        )
        .subscribe({
          next: (res) => {
            this.translators = res.data;
            this.totalTranslators = res.count;
            this.currentPage = 1;
            this.router.navigate([], { queryParams: { page: this.currentPage } });
          },
          error: (error) => console.log(error),
        });
    }
  }

  private getAdminBaseData() {
    this.adminId = this.adminService.getAdminId();
    this.role = this.adminService.getAdminRole();
    this.permissions = this.adminService.getAdminPermissions() || [];
  }

  getAllTranslators() {
    this.spinnerService.show();
    const pagination: Pagination = {
      pageSize: Number(this.translatorsPerPage),
      currentPage: Number(this.currentPage) - 1,
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: this.filter,
      select: { name: 1, nameEn: 1, slug: 1, image: 1, priority: 1, createdAt: 1 },
      sort: this.sortQuery,
    };

    this.translatorService.getAllTranslator(filterData, this.searchQuery).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        this.translators = res.data;
        this.totalTranslators = res.count;
        this.totalTranslatorsStore = res.count;
        this.holdPrevData = res.data;
      },
      error: (err) => {
        this.spinnerService.hide();
        console.log(err);
      },
    });
  }

  onPageChanged(event: any) {
    this.currentPage = event;
    this.router.navigate([], { queryParams: { page: this.currentPage } });
  }

  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllTranslators();
  }

  onRemoveAllQuery() {
    this.activeSort = null;
    this.sortQuery = { createdAt: -1 };
    this.filter = null;
    this.getAllTranslators();
  }

  onCheckChange(event: any, index: number, id: string) {
    if (event) {
      this.selectedIds.push(id);
    } else {
      const i = this.selectedIds.indexOf(id);
      if (i > -1) {
        this.selectedIds.splice(i, 1);
      }
    }
  }

  onAllSelectChange(event: MatCheckboxChange) {
    this.selectedIds = [];
    if (event.checked) {
      this.translators.forEach((item) => {
        item.select = true;
        this.selectedIds.push(item._id);
      });
    } else {
      this.translators.forEach((item) => {
        item.select = false;
      });
    }
  }

  openConfirmDialog(type: string) {
    if (type === 'delete') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Confirm Delete',
          message: 'Are you sure you want to delete this data?',
        },
      });
      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (dialogResult) {
          this.deleteMultipleTranslatorById();
        }
      });
    }
  }

  private deleteMultipleTranslatorById() {
    this.spinnerService.show();
    this.translatorService.deleteMultipleTranslatorById(this.selectedIds).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        this.uiService.success(res.message);
        this.selectedIds = [];
        this.getAllTranslators();
      },
      error: (err) => {
        this.spinnerService.hide();
        console.log(err);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subRouteOne) this.subRouteOne.unsubscribe();
    if (this.subForm) this.subForm.unsubscribe();
    if (this.subReload) this.subReload.unsubscribe();
  }
}
