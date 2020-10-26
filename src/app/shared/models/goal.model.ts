import { User } from './user.model';
import { Group } from './group.model';
import { DocumentReference } from '@angular/fire/firestore';

export interface Goal {
  description: string;
  dueDate: Date;
  hasCompleted: Array<string>;
  createdBy: User;
  assignedToID: Array<string>;
  id: string;
  classID: string;
  files?: Array<File>;
  links?: Array<string>;
}
