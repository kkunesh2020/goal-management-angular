import { Class } from './class.model';
import { User } from './user.model';
import { DocumentReference } from '@angular/fire/firestore';

export default class ClassClass implements Class {
  members: number;
  title: string;
  teacherUID: string;
  students: DocumentReference[];
  id: string;
  goals: DocumentReference[];

  constructor(
    members: number,
    title: string,
    teacherUID: string,
    students: DocumentReference[],
    id: string,
    goals: DocumentReference[]
    ) {
      this.title = title;
      this.members = members;
      this.teacherUID = teacherUID;
      this.students = students;
      this.id = id;
      this.goals = goals;
    }
};
