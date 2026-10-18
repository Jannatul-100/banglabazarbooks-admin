import { Product } from './product.interface';

export interface PromoOffer {
  name: any;
  image: any;
  select: boolean;
  _id?: string;
  title?: string;
  slug?: string;
  description?: string;
  bannerImage?: string;
  mobileImage?: string;
  startDateTime?: Date;
  endDateTime?: Date;
  products?: string[] | Product[];
  createdAt?: Date;
  updatedAt?: Date;
}
