import { DocumentReference } from '@angular/fire/firestore';
import { DirectorClass } from './directorClass.model';

export default class DirectorClassClass implements DirectorClass {
    members: number;
    title: string;
    teacherUID: string;
    students: DocumentReference[];
    id: string;
    studentEmails: string[];

  constructor(
    members: number,
    title: string,
    teacherUID: string, 
    students: DocumentReference[],
    id: string,
    studentEmails: string[]
    ) {
      this.members = members;
      this.title = title;
      this.teacherUID = teacherUID;
      this.students = students;
      this.id = id;
      this.studentEmails = studentEmails;
    }
}
