import { User } from './user.model';
import { Group } from './group.model';
import { DocumentReference } from '@angular/fire/firestore';

export interface Class {
  members: number;
  title: string;
  teacherUID: string;
  students: DocumentReference[];
  id: string;
}
