import { User } from './user.model';
import { Group } from './group.model';

export interface Goal {
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  createdBy: User;
  assignedTo?: Array<User>;
  notes?: string;
  groups?: Array<Group>;

}
