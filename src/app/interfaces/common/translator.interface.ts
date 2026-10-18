export interface Translator {
  _id?: string;
  name?: string;
  nameEn?: string;
  slug?: string;
  address?: string;
  addressEn?: string;
  description?: string;
  descriptionEn?: string;
  image?: string;
  birthDate?: Date;
  priority?: number;
  select?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
