import { User } from './user.model';

export interface Group {
  uid: string;
  name: string;
  users: Array<User>;
}
