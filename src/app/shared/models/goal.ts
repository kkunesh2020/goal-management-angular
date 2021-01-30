import { Goal } from './goal.model';
import { User } from './user.model';
import { DocumentReference } from '@angular/fire/firestore';
import FileClass from './file';
import LinkClass from './link';
import NoteClass from './note';
import { Commit } from './commit.model';

export default class GoalClass implements Goal {
  description: string;
  dueDate: Date;
  hasCompleted: Array<string>;
  createdBy: User;
  assignedTo?: Array<any>;
  assignedToID: Array<string>;
  id:string;
  classID: string;
  commits: Array<Commit>;
  files: Array<FileClass>;
  links: Array<LinkClass>;
  pending: Array<string>;
  declined: Array<string>;
  declinedMessages: Array<NoteClass>;

  constructor(
    description: string,
    dueDate: Date,
    classID: string,
    hasCompleted: Array<string>,
    pending: Array<string>,
    declined: Array<string>,
    id: string,
    createdBy: User,
    assignedToID: Array<string>,
    declinedMessages?: Array<NoteClass>,
    files?: Array<FileClass>,
    links?: Array<LinkClass>,
    commits?: Array<Commit>,
    ) {
      this.description = description;
      this.dueDate = dueDate;
      this.hasCompleted = hasCompleted;
      this.createdBy = createdBy;
      this.declinedMessages = declinedMessages;
      this.assignedToID = assignedToID;
      this.id = id;
      this.classID = classID;
      this.commits = commits;
      this.files = files;
      this.links = links;
      this.pending = pending;
      this.declined = declined;
    }
};
