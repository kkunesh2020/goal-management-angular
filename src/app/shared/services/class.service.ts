import { query } from '@angular/animations';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Class } from '../models/class.model';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor(private afs: AngularFirestore) {
   }

   getClasses(teacherUID: string): Class[] {
    const classes: Class[] = [];
    console.log('getting classes for teacher');
    this.afs.firestore.collection('classes').where('teacherUID', '==', teacherUID).get().then((querySnapshot) => {
      querySnapshot.forEach(function(doc) {
        classes.push({id: doc.id, teacherUID: doc.data().teacherUID, students: doc.data().students, title: doc.data().title, members: doc.data().members});
      });
    }).catch(err => console.log(err));
    return classes;
  }

  async getClass(teacherUID: string, classID:string): Promise<any> {
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
