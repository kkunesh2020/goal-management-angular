import { User } from './user.model';
import { DocumentReference } from '@angular/fire/firestore';
import FileClass from './file';
import LinkClass from './link';
import NoteClass from './note';
import CommitClass from './commit';

export interface Goal {
  description: string;
  dueDate: Date;
  //array of student ids who have completed the goal
  hasCompleted: Array<string>;
  //array of student ids who have pending status
  pending: Array<string>;
  //array of student ids who have declined status
  declined: Array<string>;
  createdBy: User;
  //array of student ids who have been assigned this goal
  assignedToID: Array<string>;
  id: string;
  classID: string;
  declinedMessages?: Array<NoteClass>;
  files?: Array<FileClass>;
  commits?:Array<CommitClass>;
  links?: Array<LinkClass>;
}
