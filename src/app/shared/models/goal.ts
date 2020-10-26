import { Goal } from './goal.model';
import { User } from './user.model';
import { Group } from './group.model';
import { DocumentReference } from '@angular/fire/firestore';

export default class GoalClass implements Goal {
  description: string;
  dueDate: Date;
  hasCompleted: Array<string>;
  createdBy: User;
  assignedTo?: Array<any>;
  assignedToID: Array<string>;
  id:string;
  classID: string;
  files: Array<File>;
  links: Array<string>;

  constructor(
    description: string,
    dueDate: Date,
    classID: string,
    hasCompleted: Array<string>,
    id: string,
    createdBy: User,
    assignedToID: Array<string>,
    files?: Array<File>,
    links?: Array<string>
    ) {
      this.description = description;
      this.dueDate = dueDate;
      this.hasCompleted = hasCompleted;
      this.createdBy = createdBy;
      this.assignedToID = assignedToID;
      this.id = id;
      this.classID = classID;
      this.files = files;
      this.links = links;
    }
};
