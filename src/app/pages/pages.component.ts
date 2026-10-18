import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {AdminService} from '../services/admin/admin.service';
import {UiService} from '../services/core/ui.service';
import {PUBLISHER_MENU, SUPER_ADMIN_MENU} from '../core/utils/menu-data';
import {AdminRolesEnum} from '../enum/admin.roles.enum';
import {AdminMenu} from '../interfaces/core/admin-menu.interface';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, OnDestroy {

  // Store Data
  allMenus: AdminMenu[] = SUPER_ADMIN_MENU;

  selectedValue: string;
  sideNav = true;
  sideRes = false;
  subId = 0;
  step = 0;
  windowWidth: any;
  USER_ROLE: any;
  private subRoute: Subscription;

  @ViewChild('dashboard') dashboard: ElementRef;


  constructor(
    private adminService: AdminService,
    private router: Router,
    private uiService: UiService,
  ) {
  }

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.subId = JSON.parse(sessionStorage.getItem('sub-id'));
    this.USER_ROLE = this.adminService.getAdminRole();

    this.setMenusByRoleAndAccess();

    this.subRoute = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRoutePermission(event.urlAfterRedirects || event.url);
      });

    // Check initial route
    this.checkRoutePermission(this.router.url);
  }

  private setMenusByRoleAndAccess() {
    if (this.USER_ROLE === AdminRolesEnum.PUBLISHER) {
      this.allMenus = PUBLISHER_MENU;
    } else if (this.USER_ROLE === AdminRolesEnum.SUPER_ADMIN) {
      this.allMenus = SUPER_ADMIN_MENU;
    } else {
      const accessPages = this.adminService.getAdminAccessPages();
      if (accessPages && accessPages.length > 0) {
        this.allMenus = SUPER_ADMIN_MENU.filter((m) => this.isMenuAllowed(m, accessPages));
      } else {
        this.allMenus = this.getDefaultMenuForRole(this.USER_ROLE);
      }
    }
  }

  private isMenuAllowed(menu: AdminMenu, accessPages: string[]): boolean {
    if (menu.routerLink === 'profile') {
      return true;
    }
    const rootRoute = menu.routerLink
      ? menu.routerLink.split('/')[0]
      : (menu.subMenus?.[0]?.routerLink?.split('/')[0] || '');
    return accessPages.includes(rootRoute);
  }

  private getDefaultMenuForRole(role: string): AdminMenu[] {
    if (role === AdminRolesEnum.MODERATOR) {
      const allowed = ['dashboard', 'sales', 'product', 'user', 'profile'];
      return SUPER_ADMIN_MENU.filter((m) => this.isMenuAllowed(m, allowed));
    }
    if (role === AdminRolesEnum.SALESMAN) {
      const allowed = ['dashboard', 'sales', 'product', 'profile'];
      return SUPER_ADMIN_MENU.filter((m) => this.isMenuAllowed(m, allowed));
    }
    if (role === AdminRolesEnum.EDITOR) {
      const allowed = ['dashboard', 'product', 'catalog', 'blog', 'comment', 'gallery', 'profile'];
      return SUPER_ADMIN_MENU.filter((m) => this.isMenuAllowed(m, allowed));
    }
    return SUPER_ADMIN_MENU;
  }

  private checkRoutePermission(url: string) {
    if (!url || this.USER_ROLE === AdminRolesEnum.SUPER_ADMIN || this.USER_ROLE === AdminRolesEnum.PUBLISHER) {
      return;
    }
    const accessPages = this.adminService.getAdminAccessPages();
    if (!accessPages || accessPages.length === 0) {
      return;
    }
    const cleanUrl = url.split('?')[0];
    const segments = cleanUrl.split('/').filter((s) => !!s);
    if (!segments.length) {
      return;
    }
    const rootRoute = segments[0];
    // Always allowed
    if (rootRoute === 'profile') {
      return;
    }
    if (!accessPages.includes(rootRoute)) {
      this.uiService.warn('You do not have access to this page');
      const fallback = accessPages.includes('dashboard') ? '/dashboard' : `/${accessPages[0]}`;
      this.router.navigate([fallback]);
    }
  }

  ngOnDestroy(): void {
    if (this.subRoute) {
      this.subRoute.unsubscribe();
    }
  }

  /**
   * ALL SIDE BAR CONTROLL METHOD
   * sideNavToggle()
   * sideMenuHide()
   */
  sideNavToggle() {
    this.sideNav = !this.sideNav;
    if (this.sideNav) {
      this.sideRes = false;
    } else {
      this.sideRes = true;
    }
  }
  subMenuToggle(num: any) {
    this.windowWidth = window.innerWidth;
    sessionStorage.setItem('sub-id', num);
    if (this.subId && this.subId === num) {
      this.subId = 0;
      this.dashboard.nativeElement.classList.add('link-active');
    } else {
      this.subId = JSON.parse(sessionStorage.getItem('sub-id'));
      sessionStorage
      this.dashboard.nativeElement.classList.remove('link-active');
    }
    if (num === 0) {
      this.dashboard.nativeElement.classList.add('link-active');
    }
  }

  @HostListener('window:resize')
  onInnerWidthChange() {
    this.windowWidth = window.innerWidth;
  }

  onLogout() {
    this.adminService.adminLogOut();
  }

}
