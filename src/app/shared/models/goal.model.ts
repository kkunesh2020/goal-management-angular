import { User } from './user.model';
import { Group } from './group.model';

export interface Goal {
  description: string;
  dueDate: Date;
  hasCompleted: Array<String>;
  createdBy: User;
  assignedTo?: Array<User>;
  assignedToID: Array<String>;
  id: string;
  classID: String;
}
