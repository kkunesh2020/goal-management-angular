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
}
