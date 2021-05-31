import { DocumentReference } from "@angular/fire/firestore";

export interface DirectorClass {
    title: string;
    teacherEmail: string;
    students: DocumentReference[];
    id: string;
    classIcon: string;
  }
