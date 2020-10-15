import { Goal } from './goal.model';
import { User } from './user.model';
import { Group } from './group.model';

export default class GoalClass implements Goal {
  description: string;  dueDate: Date;
  hasCompleted: string[];
  createdBy: User;
  assignedTo?: Array<User>;
  notes?: string;
  groups?: Array<Group>;
  assignedToID: Array<String>;
  id:string;
  classID: string;

  constructor(
    description: string,
    dueDate: Date,
    classID: string,
    hasCompleted: string[],
    id: string,
    createdBy: User,
    assignedToID: Array<String>,
    assignedTo?: Array<User>,
    notes?: string,
    groups?: Array<Group>
    ) {
      this.description = description;
      this.dueDate = dueDate;
      this.hasCompleted = hasCompleted;
      this.createdBy = createdBy;
      this.assignedTo = assignedTo;
      this.notes = notes;
      this.assignedToID = assignedToID;
      this.groups = groups;
      this.id = id;
      this.classID = classID;
    }
};
