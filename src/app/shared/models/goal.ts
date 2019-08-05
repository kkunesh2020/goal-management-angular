import { Goal } from './goal.model';
import { User } from './user.model';
import { Group } from './group.model';
import { Status } from './status';

export default class GoalClass implements Goal {
  description: string;
  dueDate: Date;
  status: Status;
  createdBy: User;
  createdAt: Date;
  assignedTo?: User;
  notes?: string;

  constructor(
    description: string,
    dueDate: Date,
    status: Status,
    createdBy: User,
    createdAt: Date,
    assignedTo?: User,
    notes?: string,
    ) {
      this.description = description;
      this.dueDate = dueDate;
      this.status = status;
      this.createdBy = createdBy;
      this.createdAt = createdAt;
      this.assignedTo = assignedTo;
      this.notes = notes;
    }
}
