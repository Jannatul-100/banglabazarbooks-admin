export interface Activities {
  _id?: string;
  name?: string;
  slug?: string;
  image?: string;
  mobileImage?: string;
  description?: string;
  shortDesc?:string;
  priority?:number;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
