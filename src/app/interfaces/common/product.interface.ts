import { Brand } from './brand.interface';
import {Tag} from './tag.interface';
import {Variation, VariationOption} from './variation.interface';
import {Category} from './category.interface';
import {SubCategory} from './sub-category.interface';
import {Author} from './author.interface';
import {Publisher} from './publisher.interface';
import {Translator} from './translator.interface';

export interface Product {
  selectedVariation: any;
  // publisher: any;
  _id?: string;
  name: string;
  slug?: string;
  nameEn?: string;
  url?: string;
  edition?: string;
  pdfFile?: any;
  pdfUrl?: string;
  previewImages?: string[];
  previewPageLimit?: number;
  pdfFileSize?: number;
  regularPrice?: any;
  unitPrice?: any;
  description?: string;
  shortDescription?: string;
  featureTitle?: string;
  language?: string;
  country?: string;
  costPrice?: number;
  profitPercent?: number;
  totalSold?: number;
  salePrice: number;
  hasTax?: boolean;
  tax?: number;
  sku: string;
  emiMonth?: number[];
  discountType?: number;
  discountAmount?: number;
  images?: string[];
  trackQuantity?: boolean;
  quantity?: number;
  category?: Category;
  subCategory?: SubCategory;
  author?: Author[];
  editor?: Author[];
  translator?: Translator[];
  brand?: Brand;
  totalPages?:number | any;
  currentVersion?: string;
  publishedDate?:Date;
  preOrderReleaseDate?:Date | string;
  translatorName?:any;
  translatorNameEn?:any;
  publisher?: Publisher;
  tags?: string[] | Tag[];
  specifications?: ProductSpecification[];
  features?: ProductFeature[];
  hasVariations?: boolean;
  variations?: Variation[];
  variationsOptions?: VariationOption[];
  status?: string;
  approvalStatus?: string;
  isPublisherProduct?: boolean;
  pendingPriceUpdate?: {
    regularPrice: number;
    salePrice: number;
    costPrice?: number;
    requestedAt: Date;
    status: string;
  };
  isFacebookCatalog?: boolean;
  videoUrl?: string;
  threeMonth?: number;
  sixMonth?: number;
  twelveMonth?: number;
  unit?: string;
  // Seo
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  // Point
  earnPoint?: boolean;
  pointType?: number;
  pointValue?: number;
  redeemPoint?: boolean;
  redeemType?: number;
  redeemValue?: number;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
  selectedQty?: number;
  // For Create Order
  orderVariationOption?: VariationOption;
  orderVariation?: string;

  // For Offer
  offerDiscountAmount?: number;
  offerDiscountType?: number;
  resetDiscount?: boolean;
}

interface CatalogInfo {
  _id: string;
  name: string;
  slug: string;
}

export interface ProductSpecification {
  name?: string;
  value?: string;
  type?: string;
}

export interface ProductFeature {
  name?: string;
  value?: string;
}
