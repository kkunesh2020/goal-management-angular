import { Class } from './class.model';
import { User } from './user.model';
import { DocumentReference } from '@angular/fire/firestore';

export default class ClassClass implements Class {
  title: string;
  teacherUID: string;
  students: DocumentReference[];
  id: string;
  studentEmails: string[];
  goals: DocumentReference[];
  classIcon: string;

  constructor(
    title: string,
    teacherUID: string,
    students: DocumentReference[],
    id: string,
    goals: DocumentReference[],
    studentEmails: string[],
    classIcon: string
    ) {
      this.title = title;
      this.teacherUID = teacherUID;
      this.students = students;
      this.id = id;
      this.studentEmails = studentEmails;
      this.goals = goals;
      this.classIcon = classIcon;
    }
}
