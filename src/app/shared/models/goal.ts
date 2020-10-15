import { Goal } from './goal.model';
import { User } from './user.model';
import { Group } from './group.model';

export default class GoalClass implements Goal {
  description: string;  dueDate: Date;
  isCompleted: boolean;
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
    id: string,
    isCompleted: boolean,
    createdBy: User,
    assignedToID: Array<String>,
    assignedTo?: Array<User>,
    notes?: string,
    groups?: Array<Group>
    ) {
      this.description = description;
      this.dueDate = dueDate;
      this.isCompleted = isCompleted;
      this.createdBy = createdBy;
      this.assignedTo = assignedTo;
      this.notes = notes;
      this.assignedToID = assignedToID;
      this.groups = groups;
      this.id = id;
      this.classID = classID;
    }
};
