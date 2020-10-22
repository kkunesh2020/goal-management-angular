import { query } from '@angular/animations';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { StudentData } from 'src/app/teacher/class/class.component';
import { Class } from '../models/class.model';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor(private afs: AngularFirestore) {
   }

   allowedInClass(userID: string, classID: string) {
     let allowed: boolean = false;
     this.afs.firestore.collection('users').doc(userID).get().then(doc => {
      if(doc.exists) {
        doc.data().classes.forEach(ref => {
          ref.get().then(doc => {
            if(doc.data().classID == classID) {
              return true;
            }
          });
        });
      }
    });
     return allowed;
   }

   getStudentsData(studentRefs: DocumentReference[]) {
    let studentData = [];
    studentRefs.forEach(ref => {
       ref.get().then(doc => {
        studentData.push({name: doc.data().name, uid: doc.data().uid});
       });
     });

    return studentData;
   }

   getStudentsDataByID(studentUID: string[]): any[] {
    let studentData = [];
    studentUID.forEach(uid => {
        this.afs.firestore.collection("users").doc(uid).get().then(doc => {
          studentData.push({name: doc.data().name, uid: doc.data().uid});
        });
      });
    return studentData;
   }

   getStudentData(ref: DocumentReference):Promise<any> {
     let promise = ref.get().then(doc => {
       console.log("got the student data", doc.data());
       return doc.data();
     });
     return promise;
   }

   getLengthOf(array: any[]){
    if(array == null){
      return 0;
    }
    return array.length;
  }

   getStudentsDataByReference(refs: DocumentReference[]): Observable<any> {
    let studentsData: StudentData[] = [];
    refs.forEach(studentRef => {
      this.getStudentData(studentRef).then((student) => {
        let data: StudentData = {name: student.name, goalsAssigned: this.getLengthOf(student.goalsAssigned),
          goalsCompleted: this.getLengthOf(student.goalsCompleted)} as StudentData;
        studentsData.push(data);
      });
    });
    return of(studentsData);
   }

   getClasses(userID: string): Class[] {
    const classes: Class[] = [];
    console.log('getting classes for user');
    this.afs.firestore.collection('users').doc(userID).get().then((doc) => {
      if(doc.exists) {
        doc.data().classes.forEach(ref => {
          ref.get().then(doc => classes.push(doc.data()));
        });
      }

    }).catch(err => console.log(err));
    return classes;
  }

  getClass(teacherUID: string, classID:string): Promise<any> {
    let promise = this.afs.firestore.collection('classes').doc(classID).get().then(doc => {
      console.log("got the class", doc.exists, doc.data().teacherUID == teacherUID, teacherUID);
      if (doc.exists && doc.data().teacherUID == teacherUID) {
        console.log("correct class", doc.data());
        return doc.data();
    } else {
        console.log("No such document or inavlid teacher uid!");
        return null;
    }
    });
    return promise;
  }
}
