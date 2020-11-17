import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, CollectionReference, DocumentReference } from '@angular/fire/firestore';
import { StudentData } from 'src/app/teacher/class/class.component';
import { Class } from '../models/class.model';
import UserClass from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private userCollection: CollectionReference;
  private classCollection: CollectionReference;
  constructor(private afs: AngularFirestore) {
    this.userCollection = afs.firestore.collection('users');
    this.classCollection = afs.firestore.collection('classes');
   }

   allowedInClass(userID: string, classID: string) {
     let allowed = false;
     this.userCollection.doc(userID).get().then(doc => {
      if (doc.exists) {
        doc.data().classes.forEach(ref => {
          ref.get().then(doc => {
            if (doc.data().classID == classID) {
              return true;
            }
          });
        });
      }
    });
     return allowed;
   }

   getStudentDataByID(id: string): Promise<UserClass>{
    let promise = this.userCollection.doc(id).get().then((doc) => {
      return new UserClass(id, doc.data().name, doc.data().email,  doc.data().isAdmin,
      doc.data().classes, doc.data().goalsAssigned, doc.data().goalsCompleted);
    });
    return promise;
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

   async getStudentsDataByID(studentUID: string[]): Promise<any[]> {
    let studentData = [];
    for(let uid of studentUID){
      let doc =  await this.userCollection.doc(uid).get();
      studentData.push({name: doc.data().name, uid: doc.data().uid});
    } 
    return studentData;
   }

   getStudentData(ref: DocumentReference): Promise<any> {
     let promise = ref.get().then(doc => {
       return doc.data();
     });
     return promise;
   }

   getLengthOf(array: any[]) {
    if(array == null) {
      return 0;
    }
    return array.length;
  }

   async getStudentsDataByReference(refs: DocumentReference[]): Promise<any> {
    let studentsData: StudentData[] = [];
    for(let studentRef of refs){
      let student = await this.getStudentData(studentRef);
        let data: StudentData = {name: student.name, goalsAssigned: this.getLengthOf(student.goalsAssigned),
          goalsCompleted: this.getLengthOf(student.goalsCompleted), id: studentRef.id} as StudentData;
        studentsData.push(data);
    }
    return studentsData;
   }

   getClasses(userID: string): Class[] {
    const classes: Class[] = [];
    console.log('getting classes for user');
    this.userCollection.doc(userID).get().then((doc) => {
      if(doc.exists) {
        doc.data().classes.forEach(ref => {
          ref.get().then(doc => classes.push(doc.data()));
        });
      }

    }).catch(err => console.log(err));
    return classes;
  }

  getClass(teacherUID: string, classID: string): Promise<any> {
    let promise = this.classCollection.doc(classID).get().then(doc => {
      if (doc.exists) {
        return doc.data();
    } else {
        console.log("No such document or inavlid teacher uid!");
        return null;
    }
    });
    return promise;
  }
}
