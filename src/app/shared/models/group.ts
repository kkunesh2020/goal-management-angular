import { Group } from './group.model';
import { User } from './user.model';

export default class GroupClass implements Group {
  uid: string;
  name: string;
  users: Array<User>;

  constructor(uid: string, name: string, users?: Array<User>) {
    this.uid = uid;
    this.name = name;
    this.users = users;
  }
}
