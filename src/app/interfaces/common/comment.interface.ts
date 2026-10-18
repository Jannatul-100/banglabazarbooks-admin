import {Blog} from "./blog.interface";

export interface Comment {
  _id?: string;
  readOnly?: boolean;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  queryType?: string;
  blog?: string | Blog;
  subject?: string;
  message?: string;
  receivingMails?: string;
  emailSent?: string;
  select?:boolean;
  reviewDate: string;
  review: string;
  rating: number;
  status: boolean;
  isReview: boolean;
  isComment: boolean;
  reply: string;
  replyDate: string;
  createdAt?:Date;
}
