import { DocumentReference } from '@angular/fire/firestore';
import { DirectorClass } from './directorClass.model';

export default class DirectorClassClass implements DirectorClass {
    title: string;
    teacherEmail: string;
    students: DocumentReference[];
    id: string;
    studentEmails: string[];
    classIcon: string;

  constructor(
    title: string,
    teacherEmail: string, 
    students: DocumentReference[],
    id: string,
    classIcon: string
    ) {
      this.title = title;
      this.teacherEmail = teacherEmail;
      this.students = students;
      this.id = id;
      this.classIcon = classIcon;
    }
}
