export interface Publisher {

  _id?: string;
  slug?: any;
  select?: any;
  name?: string;
  nameEn?: string;
  image?: string;
  description?: string;
  descriptionEn?: string;
  discountType?: number;
  discountAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
