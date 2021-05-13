import { DocumentReference } from "@angular/fire/firestore";

export interface DirectorClass {
    members: number;
    title: string;
    teacherUID: string;
    students: DocumentReference[];
    studentEmails: string[];
    id: string;
  }
