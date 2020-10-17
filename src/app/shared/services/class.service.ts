import { query } from '@angular/animations';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Class } from '../models/class.model';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor(private afs: AngularFirestore) {
   }

   allowedInClass(userID: string, classID: string){
     let allowed: boolean = false;
     this.afs.firestore.collection('users').doc(userID).get().then(doc => {
      if(doc.exists){
        doc.data().classes.forEach(ref => {
          ref.get().then(doc => {
            if(doc.data().classID == classID){
              return true;
            }
          });
        })
      }
    })
    return allowed;
   }

   getStudentData(studentRef: DocumentReference): Promise<any>{
     let promise = studentRef.get().then((doc) => {
       return doc.data();
     })

     return promise;
   }

   getClasses(userID: string): Class[] {
    const classes: Class[] = [];
    console.log('getting classes for user');
    this.afs.firestore.collection('users').doc(userID).get().then((doc) => {
      if(doc.exists){
        doc.data().classes.forEach(ref => {
          ref.get().then(doc => classes.push(doc.data()));
        })
      }

    }).catch(err => console.log(err));
    return classes;
  }

  getClass(teacherUID: string, classID:string): Promise<any> {
    let promise = this.afs.firestore.collection('classes').doc(classID).get().then(doc => {
      console.log("got the class", doc.exists, doc.data().teacherUID == teacherUID, teacherUID);
      if (doc.exists && doc.data().teacherUID == teacherUID) {
        console.log("correct class", doc.data())
        return doc.data();
    } else {
        console.log("No such document or inavlid teacher uid!");
        return null;
    }
    })
    return promise;
  }
}
