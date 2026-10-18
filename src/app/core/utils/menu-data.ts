import {AdminMenu} from '../../interfaces/core/admin-menu.interface';

export const SUPER_ADMIN_MENU: AdminMenu[] = [
  {
    id: 0,
    name: 'Dashboard',
    hasSubMenu: false,
    routerLink: 'dashboard',
    icon: 'space_dashboard',
    subMenus: [],
  },

  {
    id: 5,
    name: 'Sales',
    hasSubMenu: true,
    routerLink: null,
    icon: 'real_estate_agent',
    subMenus: [
      {
        id: 1,
        name: 'Orders List',
        hasSubMenu: true,
        routerLink: 'sales/all-orders',
        icon: 'arrow_right',
      },
      {
        id: 9,
        name: 'Pre Orders',
        hasSubMenu: true,
        routerLink: 'sales/pre-orders',
        icon: 'arrow_right',
      },
      {
        id: 6,
        name: 'Draft Orders',
        hasSubMenu: true,
        routerLink: 'sales/draft-orders',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Transaction',
        hasSubMenu: true,
        routerLink: 'sales/transaction',
        icon: 'arrow_right',
      },
      {
        id: 3,
        name: 'Shipping Charge',
        hasSubMenu: true,
        routerLink: 'sales/shipping-charge',
        icon: 'arrow_right',
      },
      {
        id: 4,
        name: 'bKash Refund',
        hasSubMenu: true,
        routerLink: 'sales/bkash-refund',
        icon: 'arrow_right',
      },
      {
        id: 5,
        name: 'Packing Station',
        hasSubMenu: true,
        routerLink: 'sales/packing-station',
        icon: 'arrow_right',
      },
      {
        id: 7,
        name: 'Moderator Activity',
        hasSubMenu: true,
        routerLink: 'sales/moderator-activity',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 3,
    name: 'Product',
    hasSubMenu: true,
    routerLink: null,
    icon: 'inventory',
    subMenus: [
      {
        id: 1,
        name: 'Product Add',
        hasSubMenu: true,
        routerLink: 'product/add-product',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Product List',
        hasSubMenu: true,
        routerLink: 'product/all-product',
        icon: 'arrow_right',
      },
      {
        id: 22,
        name: 'Bulk Upload',
        hasSubMenu: true,
        routerLink: 'product/bulk-upload',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Low Stock',
        hasSubMenu: true,
        routerLink: 'product/low-stock',
        icon: 'arrow_right',
      },
      {
        id: 3,
        name: 'Best Seller Product',
        hasSubMenu: true,
        routerLink: 'product/best-seller-product',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 9,
    name: 'Blog Area',
    hasSubMenu: true,
    routerLink: null,
    icon: 'rss_feed',
    subMenus: [
      {
        id: 1,
        name: 'Blog',
        hasSubMenu: true,
        routerLink: 'blog/all-blog',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 1022,
    name: 'Blog Comments',
    hasSubMenu: true,
    routerLink: null,
    icon: 'contacts',
    subMenus: [
      {
        id: 1,
        name: 'Comment',
        hasSubMenu: true,
        routerLink: 'comment/all-comment',
        icon: 'arrow_right',
      },
    ],
  },

  {
    id: 2222,
    name: 'Our Activities',
    hasSubMenu: true,
    routerLink: null,
    icon: 'rss_feed',
    subMenus: [
      {
        id: 1,
        name: 'Activities',
        hasSubMenu: true,
        routerLink: 'activities/all-activities',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 222222,
    name: 'Activities comment',
    hasSubMenu: true,
    routerLink: null,
    icon: 'rss_feed',
    subMenus: [
      {
        id: 1,
        name: 'Activities',
        hasSubMenu: true,
        routerLink: 'activities-comment/all-activities-comment',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 10222,
    name: 'Notification',
    hasSubMenu: true,
    routerLink: null,
    icon: 'contacts',
    subMenus: [
      {
        id: 1,
        name: 'Notification',
        hasSubMenu: true,
        routerLink: 'notification/all-notification',
        icon: 'arrow_right',
      },
    ],
  },

  {
    id: 1,
    name: 'Customization',
    hasSubMenu: true,
    routerLink: null,
    icon: 'auto_fix_off',
    subMenus: [
      {
        id: 1,
        name: 'Carousel',
        hasSubMenu: true,
        routerLink: 'customization/all-carousels',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Banner',
        hasSubMenu: true,
        routerLink: 'customization/all-banner',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Shop Information',
        hasSubMenu: true,
        routerLink: 'customization/shop-information',
        icon: 'arrow_right',
      },
      {
        id: 4,
        name: 'Settings',
        hasSubMenu: true,
        routerLink: 'customization/setting',
        icon: 'arrow_right',
      },
      {
        id: 5,
        name: 'Facebook Catalog',
        hasSubMenu: true,
        routerLink: 'customization/facebook-catalog',
        icon: 'arrow_right',
      },
      {
        id: 3,
        name: 'Popup',
        hasSubMenu: true,
        routerLink: 'customization/all-popup',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 2,
    name: 'Catalog',
    hasSubMenu: true,
    routerLink: null,
    icon: 'category',
    subMenus: [
      {
        id: 1,
        name: 'Categories',
        hasSubMenu: true,
        routerLink: 'catalog/all-categories',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: ' Sub Categories',
        hasSubMenu: true,
        routerLink: 'catalog/all-subCategories',
        icon: 'arrow_right',
      },
      // {
      //   id: 3,
      //   name: 'Brand',
      //   hasSubMenu: true,
      //   routerLink: 'catalog/all-brand',
      //   icon: 'arrow_right',
      // },
      {
        id: 4,
        name: 'Publisher',
        hasSubMenu: true,
        routerLink: 'catalog/all-publisher',
        icon: 'arrow_right',
      },
      {
        id: 5,
        name: 'Author',
        hasSubMenu: true,
        routerLink: 'catalog/all-author',
        icon: 'arrow_right',
      },
      {
        id: 7,
        name: 'Translator',
        hasSubMenu: true,
        routerLink: 'catalog/all-translator',
        icon: 'arrow_right',
      },
      {
        id: 6,
        name: 'Tags',
        hasSubMenu: true,
        routerLink: 'catalog/all-tag',
        icon: 'arrow_right',
      },
    ],
  },


  {
    id: 4,
    name: 'Gallery',
    hasSubMenu: true,
    routerLink: null,
    icon: 'collections',
    subMenus: [
      {
        id: 1,
        name: 'Images',
        hasSubMenu: true,
        routerLink: 'gallery/all-images',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Folders',
        hasSubMenu: true,
        routerLink: 'gallery/all-folders',
        icon: 'arrow_right',
      },
      {
        id: 3,
        name: 'Files',
        hasSubMenu: true,
        routerLink: 'gallery/all-file',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 7,
    name: 'Customer',
    hasSubMenu: true,
    routerLink: null,
    icon: 'person_3',
    subMenus: [
      {
        id: 1,
        name: 'All Customres',
        hasSubMenu: true,
        routerLink: 'user/user-list',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 10,
    name: 'Contact',
    hasSubMenu: true,
    routerLink: null,
    icon: 'contacts',
    subMenus: [
      {
        id: 1,
        name: 'Contact',
        hasSubMenu: true,
        routerLink: 'contact/all-contact',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Newsletter',
        hasSubMenu: true,
        routerLink: 'contact/all-newsletter',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 11,
    name: 'Review',
    hasSubMenu: true,
    routerLink: null,
    icon: 'rate_review',
    subMenus: [
      {
        id: 1,
        name: 'All Review',
        hasSubMenu: true,
        routerLink: 'review',
        icon: 'arrow_right',
      }

    ],
  },

  {
    id: 140,
    name: 'Manuscript',
    hasSubMenu: true,
    routerLink: null,
    icon: 'local_offer',
    subMenus: [
      // {
      //   id: 1,
      //   name: 'Add Manuscript',
      //   hasSubMenu: true,
      //   routerLink: 'manuscript/add-manuscript',
      //   icon: 'arrow_right',
      // },
      {
        id: 2,
        name: 'All Manuscript',
        hasSubMenu: true,
        routerLink: 'manuscript/all-manuscript',
        icon: 'arrow_right',
      },
    ],
  },





  {
    id: 6,
    name: 'Offer',
    hasSubMenu: true,
    routerLink: null,
    icon: 'local_offer',
    subMenus: [
      {
        id: 1,
        name: 'Promo Offer',
        hasSubMenu: true,
        routerLink: 'offer/all-promo-offer',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Coupon List',
        hasSubMenu: true,
        routerLink: 'offer/all-coupon',
        icon: 'arrow_right',
      },
      // {
      //   id: 66,
      //   name: 'Multi Promo Offer',
      //   hasSubMenu: true,
      //   routerLink: 'offer/all-multi-promo-offer',
      //   icon: 'arrow_right',
      // },
      {
        id: 3,
        name: 'Special Packages',
        hasSubMenu: true,
        routerLink: 'offer/special-package',
        icon: 'arrow_right',
      },
      {
        id: 4,
        name: 'Order Offer',
        hasSubMenu: true,
        routerLink: 'offer/order-offer',
        icon: 'arrow_right',
      }
    ],
  },



  {
    id: 1403,
    name: 'Youtube Video',
    hasSubMenu: true,
    routerLink: null,
    icon: 'local_offer',
    subMenus: [
      // {
      //   id: 1,
      //   name: 'Add Manuscript',
      //   hasSubMenu: true,
      //   routerLink: 'manuscript/add-manuscript',
      //   icon: 'arrow_right',
      // },
      {
        id: 2,
        name: 'All Video',
        hasSubMenu: true,
        routerLink: 'video/all-video',
        icon: 'arrow_right',
      },
    ],
  },

  {
    id: 1201,
    name: 'Address',
    hasSubMenu: true,
    routerLink: null,
    icon: 'local_offer',
    subMenus: [
      {
        id: 1,
        name: 'All District',
        hasSubMenu: true,
        routerLink: 'address/all-divisions',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Area',
        hasSubMenu: true,
        routerLink: 'address/all-area',
        icon: 'arrow_right',
      },
      {
        id: 3,
        name: 'Zone',
        hasSubMenu: true,
        routerLink: 'address/all-zone',
        icon: 'arrow_right',
      }
    ],
  },


  {
    id: 8,
    name: 'Admin Control',
    hasSubMenu: true,
    routerLink: null,
    icon: 'admin_panel_settings',
    subMenus: [
      {
        id: 1,
        name: 'All Admin',
        hasSubMenu: true,
        routerLink: 'admin-control/all-admins',
        icon: 'arrow_right',
      }
    ],
  },


  {
    id: 555,
    name: 'All Offline Store',
    hasSubMenu: true,
    routerLink: null,
    icon: 'rss_feed',
    subMenus: [
      {
        id: 1,
        name: 'Offline Store',
        hasSubMenu: true,
        routerLink: 'praptisthana/all-praptisthana',
        icon: 'arrow_right',
      }
    ],
  },
  {
    id: 123,
    name: 'Seo Page',
    hasSubMenu: true,
    routerLink: null,
    icon: 'find_in_page',
    subMenus: [
      {
        id: 123,
        name: 'All Seo Page',
        hasSubMenu: true,
        routerLink: 'seo-page/all-seo-page',
        icon: 'arrow_right',
      },
      {
        id: 123,
        name: 'Add Seo Page',
        hasSubMenu: true,
        routerLink: 'seo-page/add-seo-page',
        icon: 'arrow_right',
      },
      {
        id: 124,
        name: 'All Redirect Url',
        hasSubMenu: true,
        routerLink: 'seo-page/all-redirect-url',
        icon: 'arrow_right',
      },
      {
        id: 125,
        name: 'Add Redirect Url',
        hasSubMenu: true,
        routerLink: 'seo-page/add-redirect-url',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 11,
    name: 'Landing Page',
    hasSubMenu: true,
    routerLink: null,
    icon: 'web',
    subMenus: [
      {
        id: 1,
        name: 'All Landing Pages',
        hasSubMenu: false,
        routerLink: 'landing-page/all-landing-page',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Add Landing Page',
        hasSubMenu: false,
        routerLink: 'landing-page/add-landing-page',
        icon: 'arrow_right',
      },
    ],
  },

  {
    id: 12,
    name: 'Additional Page',
    hasSubMenu: true,
    routerLink: null,
    icon: 'note_add',
    subMenus: [
      {
        id: 1,
        name: 'Page List',
        hasSubMenu: true,
        routerLink: 'additionl-page/page-list',
        icon: 'arrow_right',
      }

    ],
  },


  {
    id: 13,
    name: 'Profile',
    hasSubMenu: false,
    routerLink: 'profile',
    icon: 'person',

    subMenus: [

    ],
  },
];

export const PUBLISHER_MENU: AdminMenu[] = [
  {
    id: 0,
    name: 'Dashboard',
    hasSubMenu: false,
    routerLink: 'dashboard',
    icon: 'space_dashboard',
    subMenus: [],
  },
  {
    id: 3,
    name: 'My Books',
    hasSubMenu: true,
    routerLink: null,
    icon: 'inventory',
    subMenus: [
      {
        id: 1,
        name: 'Add Book',
        hasSubMenu: true,
        routerLink: 'product/add-product',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'All Books',
        hasSubMenu: true,
        routerLink: 'product/all-product',
        icon: 'arrow_right',
      },
    ],
  },
  {
    id: 4,
    name: 'Media Gallery',
    hasSubMenu: false,
    routerLink: 'gallery',
    icon: 'collections',
    subMenus: [],
  },
  {
    id: 13,
    name: 'Profile',
    hasSubMenu: false,
    routerLink: 'profile',
    icon: 'person',
    subMenus: [],
  },
];
