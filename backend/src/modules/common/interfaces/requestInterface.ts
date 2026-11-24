export interface IAuthorization {
  userId: number;
  fullName: string;  
  roleId?: number;
  roleUniqueId?: string;
}

export interface IRequest<T = unknown> {
  data: T;
  auth_token: IAuthorization;
}