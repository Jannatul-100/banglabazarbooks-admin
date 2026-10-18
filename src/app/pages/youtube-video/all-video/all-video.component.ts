import {Component, OnInit, ViewChild} from '@angular/core';
import {AdminPermissions} from "../../../enum/admin-permission.enum";
import {YoutubeVideo} from "../../../interfaces/common/youtube-video.interface";
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {EMPTY, Subscription} from "rxjs";
import {AdminService} from "../../../services/admin/admin.service";
import {YoutubeVideoService} from "../../../services/common/youtube-video.service";
import {UiService} from "../../../services/core/ui.service";
import {UtilsService} from "../../../services/core/utils.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {ReloadService} from "../../../services/core/reload.service";
import {debounceTime, distinctUntilChanged, pluck, switchMap} from "rxjs/operators";
import {Pagination} from "../../../interfaces/core/pagination";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-all-video',
  templateUrl: './all-video.component.html',
  styleUrls: ['./all-video.component.scss']
})
export class AllVideoComponent implements OnInit {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];

  // Store Data
  toggleMenu: boolean = false;
  videos: YoutubeVideo[] = [];
  holdPrevData: YoutubeVideo[] = [];
  videoCount = 0;
  id?: string;

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
  searchVideo: YoutubeVideo[] = [];

  // Pagination
  currentPage = 1;
  totalVideos = 0;
  VideosPerPage = 10;
  totalVideosStore = 0;

  // FilterData
  filter: any = null;
  sortQuery: any = null;
  activeFilter1: number = null;
  activeFilter2: number = null;
  activeSort: number;
  number = [{ num: '10' }, { num: '25' }, { num: '50' }, { num: '100' }];
  selectedPagination = 0;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subForm: Subscription;
  private subRouteOne: Subscription;
  private subReload: Subscription;

  constructor(
    private adminService: AdminService,
    private youtubeVideoService: YoutubeVideoService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Reload Data
    this.subReload = this.reloadService.refreshBrand$.subscribe(() => {
      this.getAllYoutubeVideo();
    });

    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
      } else {
        this.currentPage = 1;
      }
      this.getAllYoutubeVideo();
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
            this.searchVideo = [];
            this.videos = this.holdPrevData;
            this.totalVideos = this.totalVideosStore;
            this.searchQuery = null;
            return EMPTY;
          }
          const pagination: Pagination = {
            pageSize: Number(this.VideosPerPage),
            currentPage: Number(this.currentPage) - 1,
          };

          // Select
          const mSelect = {
            name: 1,
            title: 1,
            amount: 1,
            url: 1,
            image: 1,
            mobileImage: 1,
            createdAt: 1,
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: this.filter,
            select: mSelect,
            sort: { createdAt: -1 },
          };

          return this.youtubeVideoService.getAllYoutubeVideo(
            filterData,
            this.searchQuery
          );
        })
      )
      .subscribe({
        next: (res) => {
          this.searchVideo = res.data;
          this.videos = this.searchVideo;
          this.totalVideos = res.count;
          this.currentPage = 1;
          this.router.navigate([], { queryParams: { page: this.currentPage } });
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
   * Pagination
   * onPageChanged()
   */


  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }

  public SelectChange(data: any) {
    this.VideosPerPage = data;
    this.selectedPagination = data;
    this.getAllYoutubeVideo();
  }



  /**
   * HTTP REQ HANDLE
   * getAllVideo()
   * deleteYoutubeVideoById()
   * deleteMultipleYoutubeVideoById()
   * deleteMultipleFile()
   */

  private getAllYoutubeVideo() {
    // Select
    const mSelect = {
      name: 1,
      title: 1,
      amount: 1,
      url: 1,
      image: 1,
      mobileImage: 1,
      createdAt: 1,
    };

    const filter: FilterData = {
      filter: this.filter,
      pagination: null,
      select: mSelect,
      sort: { createdAt: -1 },
    };

    this.subDataOne = this.youtubeVideoService
      .getAllYoutubeVideo(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.videos = res.data;
            this.videoCount = res.count;
            this.holdPrevData = this.videos;
            this.totalVideosStore = this.videoCount;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private deleteMultipleYoutubeVideoById() {
    this.spinner.show();
    this.subDataTwo = this.youtubeVideoService
      .deleteMultipleYoutubeVideoById(this.selectedIds)
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.success) {
            // Get Data array
            const selectedVideo = [];
            this.selectedIds.forEach((id) => {
              const fData = this.videos.find((data) => data._id === id);
              if (fData) {
                selectedVideo.push(fData);
              }
            });

            this.selectedIds = [];
            this.uiService.success(res.message);
            // fetch Data
            if (this.currentPage > 1) {
              this.router.navigate([], { queryParams: { page: 1 } });
            } else {
              this.getAllYoutubeVideo();
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
    const currentPageIds = this.videos.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.videos.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.videos.find((f) => f._id === m).select = false;
        const i = this.selectedIds.findIndex((f) => f === m);
        this.selectedIds.splice(i, 1);
      });
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
            this.deleteMultipleYoutubeVideoById();
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
   * DATA Sorting
   * sortData()
   */



  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllYoutubeVideo();
  }

  onRemoveAllQuery() {
    this.activeSort = null;
    this.activeFilter1 = null;
    this.activeFilter2 = null;
    this.sortQuery = { createdAt: -1 };
    this.filter = null;
    this.dataFormDateRange.reset();
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } });
    } else {
      this.getAllYoutubeVideo();
    }
  }


  /**
   * ON DESTROY
   * ngOnDestroy()
   */

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }

    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }

    if (this.subForm) {
      this.subForm.unsubscribe();
    }

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }

    if (this.subForm) {
      this.subForm.unsubscribe();
    }
    if (this.subReload) {
      this.subReload.unsubscribe();
    }
  }

}
