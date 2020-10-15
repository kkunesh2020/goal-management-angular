import { User } from './user.model';
import { Group } from './group.model';

export interface Goal {
  description: string;
  dueDate: Date;
  hasCompleted: string[];
  createdBy: User;
  assignedTo?: Array<User>;
  assignedToID: Array<String>;
  notes?: string;
  groups?: Array<Group>;
  id: string;
  classID: String;
}
