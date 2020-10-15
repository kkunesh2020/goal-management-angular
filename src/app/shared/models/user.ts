import { User } from './user.model';
import { Group } from './group.model';
import { Class } from './class.model';
import { DocumentReference } from '@angular/fire/firestore';

export default class UserClass implements User {
  uid: string;
  name: string;
  email: string;
  isAdmin: boolean;
  classes: Array<DocumentReference>;

  constructor(
    uid: string,
    name: string,
    email: string,
    isAdmin: boolean,
    classes: Array<DocumentReference>,
  ) {
    this.uid = uid;
    this.name = name;
    this.email = email;
    this.isAdmin = isAdmin;
    this.classes = classes;
  }
}
