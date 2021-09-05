import { User } from './user.model';
import { Class } from './class.model';
import { DocumentReference } from '@angular/fire/firestore';

export default class UserClass implements User {
  name: string;
  email: string;
  accountType: string;
  classes: Array<DocumentReference>;
  goalsAssigned: Array<DocumentReference>;
  goalsCompleted: Array<DocumentReference>;

  constructor(
    name: string,
    email: string,
    accountType: string,
    classes: Array<DocumentReference>,
    goalsAssigned: Array<DocumentReference>,
    goalsCompleted: Array<DocumentReference>
  ) {
    this.name = name;
    this.email = email;
    this.accountType = accountType;
    this.classes = classes;
    this.goalsAssigned = goalsAssigned;
    this.goalsCompleted = goalsCompleted;
  }
}
