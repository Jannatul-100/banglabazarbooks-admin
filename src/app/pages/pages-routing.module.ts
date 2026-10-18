import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CheckAuthAccessGuard} from '../auth-guard/check-auth-access.guard';
import {PagesComponent} from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [CheckAuthAccessGuard]
      },

      {
        path: 'gallery',
        loadChildren: () => import('./gallery/gallery.module').then(m => m.GalleryModule),
        // canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'product',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'customization',
        loadChildren: () => import('./customization/customization.module').then(m => m.CustomizationModule),
      },
      {
        path: 'catalog',
        loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule),
      },
      {
        path: 'admin-control',
        loadChildren: () => import('./admin-control/admin-control.module').then(m => m.AdminControlModule),
        // canActivate: [CheckAuthAccessGuard]
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
      },
      {
        path: 'blog',
        loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
      },
      {
        path: 'praptisthana',
        loadChildren: () => import('./praptisthana/praptisthana.module').then(m => m.PraptisthanaModule),
      },
      {
        path: 'sales',
        loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule),
      },
      {
        path: 'contact',
        loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule),
      },
      {
        path: 'comment',
        loadChildren: () => import('./blog-comment/blog-comment.module').then(m => m.BlogCommentModule),
      },
      {
        path: 'review',
        loadChildren: () => import('./reviews/reviews.module').then(m => m.ReviewsModule),
      },
      {
        path: 'offer',
        loadChildren: () => import('./offer/offer.module').then(m => m.OfferModule),
      },
      {
        path: 'discount-percent',
        loadChildren: () => import('./discount-percent/discount-percent.module').then(m => m.DiscountPercentModule),
      },
      {
        path: 'additionl-page',
        loadChildren: () => import('./additionl-page/additionl-page.module').then(m => m.AdditionlPageModule),
      },
      {
        path:"manuscript",
        loadChildren: () => import('./manuscript/manuscript.module').then(m => m.ManuscriptModule)
      },
      {
        path:"video",
        loadChildren: () => import('./youtube-video/youtube-video.module').then(m => m.YoutubeVideoModule)
      },
      {
        path:"address",
        loadChildren:() => import('./address/address.module').then(m => m.AddressModule)
      },
      {
        path:"notification",
        loadChildren:() => import('./notification/notification.module').then(m => m.NotificationModule)
      },
      {
        path:"activities",
        loadChildren:() => import('./activities/activities.module').then(m => m.ActivitiesModule)
      },
      {
        path:"activities-comment",
        loadChildren:() => import('./activities-comment/activities-comment.module').then(m => m.ActivitiesCommentModule)
      },
      {
        path: 'seo-page',
        loadChildren: () => import('./seo-page/seo-page.module').then(m => m.SeoPageModule),
      },
      {
        path: 'landing-page',
        loadChildren: () => import('./landing-page/landing-page.module').then(m => m.LandingPageModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PagesRoutingModule {
}
