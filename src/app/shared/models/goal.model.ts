import { User } from './user.model';
import { Group } from './group.model';

export interface Goal {
  description: string;
  dueDate: Date;
  hasCompleted: Array<string>;
  createdBy: User;
  assignedToID: Array<string>;
  id: string;
  classID: string;
}
