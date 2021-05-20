import { DocumentReference } from '@angular/fire/firestore';
import { DirectorClass } from './directorClass.model';

export default class DirectorClassClass implements DirectorClass {
    title: string;
    teacherUID: string;
    students: DocumentReference[];
    id: string;
    studentEmails: string[];
    classIcon: string;

  constructor(
    title: string,
    teacherUID: string, 
    students: DocumentReference[],
    id: string,
    studentEmails: string[],
    classIcon: string
    ) {
      this.title = title;
      this.teacherUID = teacherUID;
      this.students = students;
      this.id = id;
      this.studentEmails = studentEmails;
      this.classIcon = classIcon;
    }
}
