export interface User {
  _id?: string;
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
  phoneNo?: string;
  image?: string;
  profileImg?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserAuthResponse {
  success: boolean;
  token?: string;
  data?: any;
  message?: string;
  tokenExpiredIn?: number;
}

export interface UserJwtPayload {
  _id?: string;
  username: string;
}

export interface UserGroup {
  _id: string;
  data: User[];
}
