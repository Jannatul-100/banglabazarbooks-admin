
import { Select } from '../../interfaces/core/select';
import { AdminRolesEnum } from '../../enum/admin.roles.enum';
import { AdminPermissions } from "../../enum/admin-permission.enum";
import { FileTypes } from '../../enum/file-types.enum';
import { OrderStatus } from '../../enum/order.enum';

export const ADMIN_ROLES: Select[] = [
  { value: AdminRolesEnum.SUPER_ADMIN, viewValue: 'Super Admin' },
  { value: AdminRolesEnum.ADMIN, viewValue: 'Admin' },
  { value: AdminRolesEnum.MODERATOR, viewValue: 'Moderator' },
  { value: AdminRolesEnum.EDITOR, viewValue: 'Editor' },
  { value: AdminRolesEnum.SALESMAN, viewValue: 'Sales Man' },
  { value: AdminRolesEnum.PUBLISHER, viewValue: 'Publisher' },
];

export const ADMIN_PERMISSIONS: Select[] = [
  { value: AdminPermissions.CREATE, viewValue: 'Create' },
  { value: AdminPermissions.GET, viewValue: 'Get' },
  { value: AdminPermissions.EDIT, viewValue: 'Edit' },
  { value: AdminPermissions.DELETE, viewValue: 'Delete' },
];

export const ADMIN_PAGES: Select[] = [
  { value: 'dashboard', viewValue: 'Dashboard' },
  { value: 'sales', viewValue: 'Sales (Orders & Transactions)' },
  { value: 'product', viewValue: 'Product / Books' },
  { value: 'catalog', viewValue: 'Catalog (Category, Author, Publisher, Tags)' },
  { value: 'customization', viewValue: 'Customization (Banner, Carousel, Settings)' },
  { value: 'gallery', viewValue: 'Media Gallery' },
  { value: 'user', viewValue: 'Customers / Users' },
  { value: 'contact', viewValue: 'Contact & Newsletter' },
  { value: 'review', viewValue: 'Reviews' },
  { value: 'blog', viewValue: 'Blog' },
  { value: 'comment', viewValue: 'Blog Comments' },
  { value: 'activities', viewValue: 'Activities' },
  { value: 'activities-comment', viewValue: 'Activities Comments' },
  { value: 'notification', viewValue: 'Notifications' },
  { value: 'offer', viewValue: 'Offers & Coupons' },
  { value: 'discount-percent', viewValue: 'Discount Percent' },
  { value: 'address', viewValue: 'Address & Delivery Zones' },
  { value: 'manuscript', viewValue: 'Manuscript' },
  { value: 'video', viewValue: 'Youtube Video' },
  { value: 'praptisthana', viewValue: 'Offline Stores' },
  { value: 'seo-page', viewValue: 'SEO Pages & Redirects' },
  { value: 'landing-page', viewValue: 'Landing Pages' },
  { value: 'additionl-page', viewValue: 'Additional Pages' },
  { value: 'admin-control', viewValue: 'Admin Control' },
  { value: 'profile', viewValue: 'Profile' },
];

export const GENDERS: Select[] = [
  { value: 'male', viewValue: 'Male' },
  { value: 'female', viewValue: 'Female' },
  { value: 'other', viewValue: 'Other' }
];
export const DATA_BOOLEAN: Select[] = [
  { value: true, viewValue: 'Yes' },
  { value: false, viewValue: 'No' },
];

export const YEARS: Select[] = [
  { value: 2023, viewValue: '2023' },
  { value: 2022, viewValue: '2022' },
];

export const PROJECT_SOURCES: Select[] = [
  { value: 'Client Reference', viewValue: 'Client Reference' },
  { value: 'Facebook', viewValue: 'Facebook' },
  { value: 'Fiverr', viewValue: 'Fiverr' },
  { value: 'Linkedin', viewValue: 'Linkedin' },
  { value: 'Local Reference', viewValue: 'Local Reference' },
  { value: 'Website', viewValue: 'Website' },
];

export const FILE_TYPES: Select[] = [
  { value: FileTypes.IMAGE, viewValue: 'Image' },
  { value: FileTypes.VIDEO, viewValue: 'Video' },
  { value: FileTypes.PDF, viewValue: 'Pdf' }
];

export const REPORT_FILTER: Select[] = [
  // {value: 0, viewValue: 'Today'},
  { value: 1, viewValue: 'Last Day' },
  { value: 7, viewValue: 'Last 7 days' },
  { value: 15, viewValue: 'Last 15 days' },
  { value: 30, viewValue: 'Last 30 days' },
  { value: 60, viewValue: 'Last 60 days' },
  { value: 90, viewValue: 'Last 90 days' }
];

export const PRODUCT_STATUS: Select[] = [
  { value: 'draft', viewValue: 'Draft' },
  { value: 'publish', viewValue: 'Publish' },
];

export const Language: Select[] = [
  { value: 'Bangla', viewValue: 'Bangla' },
  { value: 'English', viewValue: 'English' },
];

export const Version: Select[] = [
  { value: 'হার্ডকভার', viewValue: 'হার্ডকভার' },
  { value: 'পেপারব্যাক', viewValue: 'পেপারব্যাক' },
  { value: 'স্পাইরাল', viewValue: 'স্পাইরাল' },
  { value: 'নিউজপ্রিন্ট', viewValue: 'নিউজপ্রিন্ট' },
  { value: 'পপআপ', viewValue: 'পপআপ' },
  { value: 'রয়্যাল সাইজ', viewValue: 'রয়্যাল সাইজ' },
  { value: 'বোর্ড পেপার', viewValue: 'বোর্ড পেপার' },
];

export const PAGE_TYPES: Select[] = [
  { value: 'home_page', viewValue: 'Home Page' },
  { value: 'blog', viewValue: 'Blog' },
  { value: 'special-package', viewValue: 'Special Package' },
  { value: 'offers', viewValue: 'Offers' },
  { value: 'product-list', viewValue: 'Product List' },
  // {value: 'contact_us', viewValue: 'Contact Us'},
  // {value: 'about_page', viewValue: 'About Us'},
  // {value: 'cases', viewValue: 'Cases'},
  // {value: 'services', viewValue: 'Services'},
  // {value: 'technology', viewValue: 'Technology'},
];

export const VersionEn: Select[] = [
  { value: 'hardcover', viewValue: 'Hardcover' },
  { value: 'paperback', viewValue: 'Paperback' },
  { value: 'spiral', viewValue: 'Spiral' },
  { value: 'newsprint', viewValue: 'Newsprint' },
  { value: 'popup', viewValue: 'Popup' },
  { value: 'Royal size', viewValue: 'Royal size' },
  { value: 'Board paper', viewValue: 'Board paper' },
];

export const COUNTRY: any = [
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Åland Islands', code: 'AX' },
  { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' },
  { name: 'American Samoa', code: 'AS' },
  { name: 'AndorrA', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'Anguilla', code: 'AI' },
  { name: 'Antarctica', code: 'AQ' },
  { name: 'Antigua and Barbuda', code: 'AG' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Armenia', code: 'AM' },
  { name: 'Aruba', code: 'AW' },
  { name: 'Australia', code: 'AU' },
  { name: 'Austria', code: 'AT' },
  { name: 'Azerbaijan', code: 'AZ' },
  { name: 'Bahamas', code: 'BS' },
  { name: 'Bahrain', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Barbados', code: 'BB' },
  { name: 'Belarus', code: 'BY' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Belize', code: 'BZ' },
  { name: 'Benin', code: 'BJ' },
  { name: 'Bermuda', code: 'BM' },
  { name: 'Bhutan', code: 'BT' },
  { name: 'Bolivia', code: 'BO' },
  { name: 'Bosnia and Herzegovina', code: 'BA' },
  { name: 'Botswana', code: 'BW' },
  { name: 'Bouvet Island', code: 'BV' },
  { name: 'Brazil', code: 'BR' },
  { name: 'British Indian Ocean Territory', code: 'IO' },
  { name: 'Brunei Darussalam', code: 'BN' },
  { name: 'Bulgaria', code: 'BG' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Burundi', code: 'BI' },
  { name: 'Cambodia', code: 'KH' },
  { name: 'Cameroon', code: 'CM' },
  { name: 'Canada', code: 'CA' },
  { name: 'Cape Verde', code: 'CV' },
  { name: 'Cayman Islands', code: 'KY' },
  { name: 'Central African Republic', code: 'CF' },
  { name: 'Chad', code: 'TD' },
  { name: 'Chile', code: 'CL' },
  { name: 'China', code: 'CN' },
  { name: 'Christmas Island', code: 'CX' },
  { name: 'Cocos (Keeling) Islands', code: 'CC' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Comoros', code: 'KM' },
  { name: 'Congo', code: 'CG' },
  { name: 'Congo, The Democratic Republic of the', code: 'CD' },
  { name: 'Cook Islands', code: 'CK' },
  { name: 'Costa Rica', code: 'CR' },
  { name: 'Cote D\'Ivoire', code: 'CI' },
  { name: 'Croatia', code: 'HR' },
  { name: 'Cuba', code: 'CU' },
  { name: 'Cyprus', code: 'CY' },
  { name: 'Czech Republic', code: 'CZ' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Djibouti', code: 'DJ' },
  { name: 'Dominica', code: 'DM' },
  { name: 'Dominican Republic', code: 'DO' },
  { name: 'Ecuador', code: 'EC' },
  { name: 'Egypt', code: 'EG' },
  { name: 'El Salvador', code: 'SV' },
  { name: 'Equatorial Guinea', code: 'GQ' },
  { name: 'Eritrea', code: 'ER' },
  { name: 'Estonia', code: 'EE' },
  { name: 'Ethiopia', code: 'ET' },
  { name: 'Falkland Islands (Malvinas)', code: 'FK' },
  { name: 'Faroe Islands', code: 'FO' },
  { name: 'Fiji', code: 'FJ' },
  { name: 'Finland', code: 'FI' },
  { name: 'France', code: 'FR' },
  { name: 'French Guiana', code: 'GF' },
  { name: 'French Polynesia', code: 'PF' },
  { name: 'French Southern Territories', code: 'TF' },
  { name: 'Gabon', code: 'GA' },
  { name: 'Gambia', code: 'GM' },
  { name: 'Georgia', code: 'GE' },
  { name: 'Germany', code: 'DE' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Gibraltar', code: 'GI' },
  { name: 'Greece', code: 'GR' },
  { name: 'Greenland', code: 'GL' },
  { name: 'Grenada', code: 'GD' },
  { name: 'Guadeloupe', code: 'GP' },
  { name: 'Guam', code: 'GU' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Guernsey', code: 'GG' },
  { name: 'Guinea', code: 'GN' },
  { name: 'Guinea-Bissau', code: 'GW' },
  { name: 'Guyana', code: 'GY' },
  { name: 'Haiti', code: 'HT' },
  { name: 'Heard Island and Mcdonald Islands', code: 'HM' },
  { name: 'Holy See (Vatican City State)', code: 'VA' },
  { name: 'Honduras', code: 'HN' },
  { name: 'Hong Kong', code: 'HK' },
  { name: 'Hungary', code: 'HU' },
  { name: 'Iceland', code: 'IS' },
  { name: 'India', code: 'IN' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Iran, Islamic Republic Of', code: 'IR' },
  { name: 'Iraq', code: 'IQ' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Isle of Man', code: 'IM' },
  { name: 'Israel', code: 'IL' },
  { name: 'Italy', code: 'IT' },
  { name: 'Jamaica', code: 'JM' },
  { name: 'Japan', code: 'JP' },
  { name: 'Jersey', code: 'JE' },
  { name: 'Jordan', code: 'JO' },
  { name: 'Kazakhstan', code: 'KZ' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Kiribati', code: 'KI' },
  { name: 'Korea, Democratic People\'S Republic of', code: 'KP' },
  { name: 'Korea, Republic of', code: 'KR' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Kyrgyzstan', code: 'KG' },
  { name: 'Lao People\'S Democratic Republic', code: 'LA' },
  { name: 'Latvia', code: 'LV' },
  { name: 'Lebanon', code: 'LB' },
  { name: 'Lesotho', code: 'LS' },
  { name: 'Liberia', code: 'LR' },
  { name: 'Libyan Arab Jamahiriya', code: 'LY' },
  { name: 'Liechtenstein', code: 'LI' },
  { name: 'Lithuania', code: 'LT' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Macao', code: 'MO' },
  { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' },
  { name: 'Madagascar', code: 'MG' },
  { name: 'Malawi', code: 'MW' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Maldives', code: 'MV' },
  { name: 'Mali', code: 'ML' },
  { name: 'Malta', code: 'MT' },
  { name: 'Marshall Islands', code: 'MH' },
  { name: 'Martinique', code: 'MQ' },
  { name: 'Mauritania', code: 'MR' },
  { name: 'Mauritius', code: 'MU' },
  { name: 'Mayotte', code: 'YT' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Micronesia, Federated States of', code: 'FM' },
  { name: 'Moldova, Republic of', code: 'MD' },
  { name: 'Monaco', code: 'MC' },
  { name: 'Mongolia', code: 'MN' },
  { name: 'Montserrat', code: 'MS' },
  { name: 'Morocco', code: 'MA' },
  { name: 'Mozambique', code: 'MZ' },
  { name: 'Myanmar', code: 'MM' },
  { name: 'Namibia', code: 'NA' },
  { name: 'Nauru', code: 'NR' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'Netherlands Antilles', code: 'AN' },
  { name: 'New Caledonia', code: 'NC' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Nicaragua', code: 'NI' },
  { name: 'Niger', code: 'NE' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Niue', code: 'NU' },
  { name: 'Norfolk Island', code: 'NF' },
  { name: 'Northern Mariana Islands', code: 'MP' },
  { name: 'Norway', code: 'NO' },
  { name: 'Oman', code: 'OM' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Palau', code: 'PW' },
  { name: 'Palestinian Territory, Occupied', code: 'PS' },
  { name: 'Panama', code: 'PA' },
  { name: 'Papua New Guinea', code: 'PG' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Peru', code: 'PE' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Pitcairn', code: 'PN' },
  { name: 'Poland', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Puerto Rico', code: 'PR' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Reunion', code: 'RE' },
  { name: 'Romania', code: 'RO' },
  { name: 'Russian Federation', code: 'RU' },
  { name: 'RWANDA', code: 'RW' },
  { name: 'Saint Helena', code: 'SH' },
  { name: 'Saint Kitts and Nevis', code: 'KN' },
  { name: 'Saint Lucia', code: 'LC' },
  { name: 'Saint Pierre and Miquelon', code: 'PM' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC' },
  { name: 'Samoa', code: 'WS' },
  { name: 'San Marino', code: 'SM' },
  { name: 'Sao Tome and Principe', code: 'ST' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Senegal', code: 'SN' },
  { name: 'Serbia and Montenegro', code: 'CS' },
  { name: 'Seychelles', code: 'SC' },
  { name: 'Sierra Leone', code: 'SL' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Slovakia', code: 'SK' },
  { name: 'Slovenia', code: 'SI' },
  { name: 'Solomon Islands', code: 'SB' },
  { name: 'Somalia', code: 'SO' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'South Georgia and the South Sandwich Islands', code: 'GS' },
  { name: 'Spain', code: 'ES' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Sudan', code: 'SD' },
  { name: 'Suriname', code: 'SR' },
  { name: 'Svalbard and Jan Mayen', code: 'SJ' },
  { name: 'Swaziland', code: 'SZ' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Syrian Arab Republic', code: 'SY' },
  { name: 'Taiwan, Province of China', code: 'TW' },
  { name: 'Tajikistan', code: 'TJ' },
  { name: 'Tanzania, United Republic of', code: 'TZ' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Timor-Leste', code: 'TL' },
  { name: 'Togo', code: 'TG' },
  { name: 'Tokelau', code: 'TK' },
  { name: 'Tonga', code: 'TO' },
  { name: 'Trinidad and Tobago', code: 'TT' },
  { name: 'Tunisia', code: 'TN' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Turkmenistan', code: 'TM' },
  { name: 'Turks and Caicos Islands', code: 'TC' },
  { name: 'Tuvalu', code: 'TV' },
  { name: 'Uganda', code: 'UG' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'United States Minor Outlying Islands', code: 'UM' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Uzbekistan', code: 'UZ' },
  { name: 'Vanuatu', code: 'VU' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Viet Nam', code: 'VN' },
  { name: 'Virgin Islands, British', code: 'VG' },
  { name: 'Virgin Islands, U.S.', code: 'VI' },
  { name: 'Wallis and Futuna', code: 'WF' },
  { name: 'Western Sahara', code: 'EH' },
  { name: 'Yemen', code: 'YE' },
  { name: 'Zambia', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' }
]


export const EMI_MONTHS: Select[] = [
  {
    value: 3,
    viewValue: '3 Months'
  },
  {
    value: 6,
    viewValue: '6 Months'
  },
  {
    value: 12,
    viewValue: '12 Months'
  },
];

export const DISCOUNT_TYPES: Select[] = [
  {
    value: 1,
    viewValue: 'Percentage'
  },
  {
    value: 2,
    viewValue: 'Cash'
  },
];

export const AMOUNT_TYPES: Select[] = [
  {
    value: 1,
    viewValue: 'Percentage'
  },
  {
    value: 2,
    viewValue: 'Amount'
  },
];

export const CITIES = ['Barisal', 'Bhairab', 'Bogra', 'Brahmanbaria', 'Chandpur', 'Chittagong', 'Chowmuhani', 'Chuadanga', 'Comilla', 'Cox\'s Bazar', 'Dhaka', 'Dinajpur', 'Faridpur', 'Feni', 'Gazipur', 'Jamalpur', 'Jessore', 'Jhenaidah', 'Kaliakair', 'Khulna', 'Kishoreganj', 'Kushtia', 'Maijdee', 'Manikganj', 'Mymensingh', 'Naogaon', 'Narayanganj', 'Narsingdi', 'Nawabganj', 'Pabna', 'Rajshahi', 'Rangpur', 'Saidpur', 'Sa$hira', 'Savar', 'Siddhirganj', 'Sirajganj', 'Sreepur', 'Sylhet', 'Tangail', 'Tongi'];

export const PAYMENT_TYPES: Select[] = [
  { value: 'cash_on_delivery', viewValue: 'Cash On Delivery' },
  // { value: 'bkash', viewValue: 'Bkash'},
  { value: 'online_payment', viewValue: 'Online Payment' },
  // { value: 'rocket', viewValue: 'Rocket'},
  // { value: 'nagad', viewValue: 'Nagad'},
  // { value: 'credit_card', viewValue: 'Visa/Mastercard'},
];

export const PAYMENT_STATUS: Select[] = [
  { value: 'unpaid', viewValue: 'Unpaid' },
  { value: 'paid', viewValue: 'Paid' },
];

export const Gender_Type: Select[] = [
  { value: 'male', viewValue: 'Male' },
  { value: 'female', viewValue: 'Female' },
];



export const ORDER_STATUS: Select[] = [
  { value: OrderStatus.PENDING, viewValue: 'Pending' },
  { value: OrderStatus.CONFIRM, viewValue: 'Approved' },
  { value: OrderStatus.PROCESSING, viewValue: 'Processing' },
  { value: OrderStatus.SHIPPING, viewValue: 'Shipped' },
  { value: OrderStatus.SENT_TO_COURIER, viewValue: 'Sent to Courier' },
  { value: OrderStatus.DELIVERED, viewValue: 'Delivered' },
  { value: OrderStatus.CANCEL, viewValue: 'Cancelled' },
  { value: OrderStatus.REFUND, viewValue: 'Refund' },
  { value: OrderStatus.DRAFT, viewValue: 'Draft Order' },
];

export const TABLE_TAB_ORDER_DATA: Select[] = [
  { value: 'all', viewValue: 'All' },
  ...ORDER_STATUS
];


export const DELIVERY_TIMES: any[] = [
  // {value: '8.30 am to 10.00 am', viewValue: '8.30 am to 10.00 am', end: 6},
  // {value: '10.00 am to 11.30 am', viewValue: '10.00 am to 11.30 am', end: 8},
  // {value: '11.30 am to 01.00 pm', viewValue: '11.30 am to 01.00 pm', end: 9},
  // {value: '01.00 pm to 02.30 pm', viewValue: '01.00 pm to 02.30 pm', end: 11},
  // {value: '02.30 pm to 04.00 pm', viewValue: '02.30 pm to 04.00 pm', end: 13},
  // {value: '04.00 pm to 05.30 pm', viewValue: '04.00 pm to 05.30 pm', end: 14},
  // {value: '05.30 pm to 07.00 pm', viewValue: '05.30 pm to 07.00 pm', end: 15},
  // {value: '07.00 pm to 08.30 pm', viewValue: '07.00 pm to 08.30 pm', end: 17},


  { value: '08:30 am-09:30 am', viewValue: '08:30 am-09:30 am', end: 6 },
  { value: '09:30 am-10:30 am', viewValue: '09:30 am-10:30 am', end: 7 },
  { value: '10:30 am-11:30 am', viewValue: '10:30 am-11:30 am', end: 8 },
  { value: '11:30 am-12:30 pm', viewValue: '11:30 am-12:30 pm', end: 9 },
  { value: '12:30 pm-01:30 pm', viewValue: '12:30 pm-01:30 pm', end: 10 },
  { value: '01:30 pm-02:30 pm', viewValue: '01:30 pm-02:30 pm', end: 11 },
  { value: '02:30 pm-03:30 pm', viewValue: '02:30 pm-03:30 pm', end: 12 },
  { value: '03:30 pm-04:30 pm', viewValue: '03:30 pm-04:30 pm', end: 13 },
  { value: '04:30 pm-05:30 pm', viewValue: '04:30 pm-05:30 pm', end: 14 },
  { value: '05:30 pm-06:30 pm', viewValue: '05:30 pm-06:30 pm', end: 15 },
  { value: '06:30 pm-07:30 pm', viewValue: '06:30 pm-07:30 pm', end: 16 },
  { value: '07:30 pm-08:30 pm', viewValue: '07:30 pm-08:30 pm', end: 17 },
  { value: '08:30 pm-09:30 pm', viewValue: '08:30 pm-09:30 pm', end: 18 },
];

export const defaultUploadImage = '/assets/images/avatar/image-upload.jpg';
export const VARIATION_IMG_PLACEHOLDER = '/assets/images/placeholder/image-pick-placeholder.png';
export const PDF_MAKE_LOGO = '/assets/images/logo/logo.png';


export const MONTHS: Select[] = [
  { value: 1, viewValue: 'January' },
  { value: 2, viewValue: 'February' },
  { value: 3, viewValue: 'March' },
  { value: 4, viewValue: 'April' },
  { value: 5, viewValue: 'May' },
  { value: 6, viewValue: 'June' },
  { value: 7, viewValue: 'July' },
  { value: 8, viewValue: 'August' },
  { value: 9, viewValue: 'September' },
  { value: 10, viewValue: 'October' },
  { value: 11, viewValue: 'November' },
  { value: 12, viewValue: 'December' },
];

export const COURIER_PROVIDERS: Select[] = [
  { value: 'Steadfast Courier', viewValue: 'Steadfast Courier' },
  { value: 'Pathao Courier', viewValue: 'Pathao Courier' },
  { value: 'Sundarban Courier', viewValue: 'Sundarban Courier' },
  { value: 'REDX', viewValue: 'REDX' },
];
