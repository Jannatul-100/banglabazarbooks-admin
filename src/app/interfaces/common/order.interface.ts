import { Brand } from './brand.interface';
import {User} from './user.interface';
export interface Order {
  _id?: string;
  orderId?: string;
  discountTypes?: DiscountType[];
  name?: string;
  phoneNo?: string;
  email?: string;
  courierLink?: string;
  orderFrom?: string;
  previousOrderCount?: number;
  courierData?: {
    providerName?: string;
    consignmentId?: string;
    trackingCode?: string;
    trackingLink?: string;
  };
  city?: string;
  count?: number;
  shippingAddress?: string;
  paymentType?: string;
  division?: any;
  area?: any;
  zone?: any;
  orderedItems?: OrderedItem[];
  subTotal?: number;
  deliveryCharge?: number;
  discount?: number;
  additionalDiscount?: number;
  extraDiscount?: number;
  productDiscount?: number;
  coupon?: string;
  couponDiscount?: number;
  grandTotal: number;
  orderDiscountFromApps: number;
  checkoutDate: string;
  deliveryDate?: any;
  orderStatus?: number;
  paymentStatus?: string;
  hasOrderTimeline?: boolean;
  processingDate?: Date;
  shippingDate?: Date;
  deliveringDate?: Date;
  user?: User;
  orderTimeline?: OrderTimeline;
  preferredDate?: Date;
  preferredTime?: string;
  preferredDateString?: string;
  note?: string;
  processedBy?: any;
  createdByAdmin?: any;
  moderatorLogs?: OrderModeratorLog[];
  packingImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
  fraudChecker?: {
    courierData?: {
      summary?: {
        success_ratio?: number;
        total_parcel?: number;
      }
    }
  };
}

export interface OrderModeratorLog {
  adminId?: any;
  adminName?: string;
  adminUsername?: string;
  adminRole?: string;
  action: string;
  description?: string;
  beforeStatus?: number;
  afterStatus?: number;
  date?: Date | string;
}

export interface OrderedItem {
  // publisher: any;
  _id: string;
  name: string;
  slug: string;
  image: string;
  category: any;
  costPrice: number;
  unitPrice: number;
  salePrice: number;
  subCategory: any;
  publisher: any;
  brand: Brand;
  regularPrice: number;
  quantity: number;
  orderType: string;
  discountAmount: any;
  discountType: number;
  unit: string;
}

export interface OrderTimeline {
  confirmed?: OrderTimelineType;
  processed?: OrderTimelineType;
  shipped?: OrderTimelineType;
  delivered?: OrderTimelineType;
  canceled?: OrderTimelineType;
  refunded?: OrderTimelineType;
}

export interface DiscountType {
  type?: string;
  amount?: number;
  productDiscount?: string | number;
  extraDiscount?: number;
}

export interface OrderTimelineType {
  success: boolean;
  date?: Date;
  expectedDate?: Date;
}
