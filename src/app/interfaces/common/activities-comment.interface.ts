import {Activities} from "./activities.interface";

export interface ActivitiesComment {
  _id?: string;
  readOnly?: boolean;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  queryType?: string;
  activities?: string | Activities;
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
