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

  async assignStudentToClass(classID: string, studentData: any): Promise<any>{
    console.log("assignStudentToClass", studentData);
    let promise = this.userCollection.where("email", "==", studentData.email).get().then((docSnapshot) => {
      if(docSnapshot.empty){
        // create student data
        let dataToAdd = {
          ...studentData,
          uid: this.userCollection.doc().id,
          goalsAssigned: [],
          goalsCompleted: [],
          classes: [this.classCollection.doc(classID)],
          accountType: "student"
        }
        this.userCollection.doc(dataToAdd.uid).set(dataToAdd);
        return dataToAdd.uid;
      }else{
        // update student data
        this.userCollection.doc(studentData.uid).update({
          classes: firebase.firestore.FieldValue.arrayUnion(this.classCollection.doc(classID))
        })
        return null;
      }
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
    // create student data if necessary
    // add student uid to class 
    console.log("student data", studentData);
    let promise = new Promise(async(resolve, reject) => {
      let studentResult = await this.getStudentDataByEmail(studentData.email);
      let result = await this.assignStudentToClass(classId, studentResult ? studentResult : studentData).catch((err) => {
        reject(err);
      });
      if(!result){
        console.log("adding student", studentResult);
        this.classCollection.doc(classId).update({
          students: firebase.firestore.FieldValue.arrayUnion(studentData.email)
        }).catch((err) => {
          console.log("ERROR", err);
        })
      }else{
        this.classCollection.doc(classId).update({
          students: firebase.firestore.FieldValue.arrayUnion(studentData.email)
        })
        studentData.id = result;
      }
      resolve(studentResult);
    });
    
    return promise;
  }

   deleteStudentFromClass(classData: DirectorClass, studentData: any): Promise<any>{
    const promise = new Promise(async(resolve, reject) => {
      await this.classCollection.doc(classData.id).update({
        students: firebase.firestore.FieldValue.arrayRemove(this.userCollection.doc(studentData.uid))
      })

      await this.userCollection.doc(studentData.uid).update({
        classes: firebase.firestore.FieldValue.arrayRemove(this.classCollection.doc(classData.id))
      })
      
      resolve(studentData);
    })
    return promise;
  }


}
