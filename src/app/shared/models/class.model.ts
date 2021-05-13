import { User } from './user.model';
import { DocumentReference } from '@angular/fire/firestore';

export interface Class {
  members: number;
  title: string;
  teacherUID: string;
  students: DocumentReference[];
  goals: DocumentReference[];
  id: string;
  classIcon: string;
  studentEmails: string[];
}
