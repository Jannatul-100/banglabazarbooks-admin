import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LandingPage } from '../../../interfaces/common/landing-page.interface';
import { FilterData } from '../../../interfaces/core/filter-data';
import { Pagination } from '../../../interfaces/core/pagination';
import { LandingPageService } from '../../../services/common/landing-page.service';
import { UiService } from '../../../services/core/ui.service';

@Component({
  selector: 'app-all-landing-page',
  templateUrl: './all-landing-page.component.html',
  styleUrls: ['./all-landing-page.component.scss'],
})
export class AllLandingPageComponent implements OnInit, OnDestroy {
  landingPages: LandingPage[] = [];
  currentPage = 1;
  totalLandingPages = 0;
  landingPagesPerPage = 10;
  private subDataOne?: Subscription;

  constructor(
    private landingPageService: LandingPageService,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getAllLandingPages();
  }

  getAllLandingPages() {
    const pagination: Pagination = {
      pageSize: this.landingPagesPerPage,
      currentPage: this.currentPage - 1,
    };
    const filterData: FilterData = {
      pagination,
      filter: null,
      select: {
        name: 1,
        slug: 1,
        template: 1,
        title: 1,
        heroImage: 1,
        status: 1,
        products: 1,
        createdAt: 1,
      },
      sort: { createdAt: -1 },
    };

    this.spinner.show();
    this.subDataOne = this.landingPageService.getAllLandingPages(filterData).subscribe({
      next: (res) => {
        this.spinner.hide();
        this.landingPages = res.data;
        this.totalLandingPages = res.count;
      },
      error: () => this.spinner.hide(),
    });
  }

  copyLink(page: LandingPage) {
    const base =
      page.template === 'v2'
        ? `https://${environment.domain}/landing-page-2/`
        : `https://${environment.domain}/landing-page/`;
    const url = base + page.slug;
    navigator.clipboard.writeText(url);
    this.uiService.success('Link copied to clipboard');
  }

  onPageChanged(page: number) {
    this.currentPage = page;
    this.getAllLandingPages();
  }

  deleteLandingPage(id: string) {
    if (!confirm('Delete this landing page?')) {
      return;
    }
    this.landingPageService.deleteLandingPageById(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.uiService.success(res.message);
          this.getAllLandingPages();
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.subDataOne?.unsubscribe();
  }
}
