import { DocumentReference } from "@angular/fire/firestore";

export interface DirectorClass {
    title: string;
    teacherUID: string;
    students: any[];
    studentEmails: string[];
    id: string;
    classIcon: string;
  }
