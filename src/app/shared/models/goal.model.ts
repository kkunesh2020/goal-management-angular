import { User } from './user.model';
import { Status } from './status';

export interface Goal {
  description: string;
  dueDate: Date;
  status: Status;
  createdBy: User;
  createdAt: Date;
  assignedTo?: User;
  notes?: string;
}
