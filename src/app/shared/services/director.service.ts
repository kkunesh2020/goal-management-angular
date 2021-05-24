import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  CollectionReference,
  DocumentReference,
} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { StudentData } from 'src/app/teacher/class/class.component';
import ClassClass from '../models/class';
import { Class } from '../models/class.model';
import DirectorClassClass from '../models/directorClass';
import { DirectorClass } from '../models/directorClass.model';
import UserClass from '../models/user';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DirectorService {
  private userCollection: CollectionReference;
  private classCollection: CollectionReference;

  constructor(private afs: AngularFirestore) {
    this.userCollection = afs.firestore.collection('users');
    this.classCollection = afs.firestore.collection('classes');
  }


  async getAllStudentData(): Promise<UserClass[]>{
    let studentData: UserClass[] =[];
    let promise = this.userCollection.where('accountType', '==', "student").get().then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log("got", doc.data())
        studentData.push({uid: doc.id, ...doc.data()} as User);
      });
      return studentData;
    });
    return promise;
  }

  async getStudentDataByEmail(email: string): Promise<any>{
    let promise = this.userCollection.where("email", "==", email).get().then((data) => {
      if(data.empty){
        return null;
      }
      return data.docs[0].data();
    }).catch((err) => {
      console.log("ERROR", err);
    })
    return promise;
  }
  
  async createStudentForClass(classId: string, studentData: any): Promise<any>{
    console.log("studentData", studentData, studentData.uid, classId);
    let promise = new Promise(async(resolve, reject) => {

      await this.userCollection.doc(studentData.uid).update({
        classes: firebase.firestore.FieldValue.arrayUnion(this.classCollection.doc(classId))
      }).catch((err) => {
        reject(err);
      });

      await this.classCollection.doc(classId).update({
          students: firebase.firestore.FieldValue.arrayUnion(this.userCollection.doc(studentData.uid))
      })
      resolve(studentData);
    });
    
    return promise;
  }

   async deleteStudentFromClass(classData: DirectorClass, studentData: any){
      await this.classCollection.doc(classData.id).update({
        students: firebase.firestore.FieldValue.arrayRemove(studentData.email)
      })

      await this.userCollection.doc(studentData.uid).update({
        classes: firebase.firestore.FieldValue.arrayRemove(this.classCollection.doc(classData.id))
      })
      
      return studentData;
  }


}
