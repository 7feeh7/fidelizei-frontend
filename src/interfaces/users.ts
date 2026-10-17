export interface UserListItem {
  id: string;
  name: string;
}

export interface ListUsersResponse {
  data: UserListItem[];
}

export interface UserServices {
  list(): Promise<ListUsersResponse>;
}
