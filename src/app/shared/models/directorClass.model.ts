import { DocumentReference } from "@angular/fire/firestore";

export interface DirectorClass {
    title: string;
    teacherUID: string;
    students: DocumentReference[];
    id: string;
    classIcon: string;
  }
