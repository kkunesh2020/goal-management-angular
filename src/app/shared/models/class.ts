import { Class } from './class.model';
import { User } from './user.model';
import { Group } from './group.model';
import { DocumentReference } from '@angular/fire/firestore';

export default class ClassClass implements Class {
  members: number;
  title: string;
  teacherUID: string;
  students: DocumentReference[];
  id: string;

  constructor(
    members: number,
    title: string,
    teacherUID: string,
    students: DocumentReference[],
    id: string
    ) {
      this.title = title;
      this.members = members;
      this.teacherUID = teacherUID;
      this.students = students;
      this.id = id;
    }
};
