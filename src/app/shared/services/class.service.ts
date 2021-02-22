import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  CollectionReference,
  DocumentReference,
} from '@angular/fire/firestore';
import { StudentData } from 'src/app/teacher/class/class.component';
import { Class } from '../models/class.model';
import UserClass from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private userCollection: CollectionReference;
  private classCollection: CollectionReference;

  // initializes users and classes collections
  constructor(private afs: AngularFirestore) {
    this.userCollection = afs.firestore.collection('users');
    this.classCollection = afs.firestore.collection('classes');
  }

  // checks if a student is allowed inside a class using the student's userID and classID
  // @param userID and classID
  allowedInClass(userID: string, classID: string) {
    const allowed = false;
    this.userCollection
      .doc(userID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          doc.data().classes.forEach((ref) => {
            ref.get().then((paper) => {
              if (doc.data().classID === classID) {
                return true;
              }
            });
          });
        }
      });
    return allowed;
  }

  // get a student's data with their userID
  // @param id
  getStudentDataByID(id: string): Promise<UserClass> {
    const promise = this.userCollection
      .doc(id)
      .get()
      .then((doc) => {
        return new UserClass(
          id,
          doc.data().name,
          doc.data().email,
          doc.data().isAdmin,
          doc.data().classes,
          doc.data().goalsAssigned,
          doc.data().goalsCompleted
        );
      });
    return promise;
  }

  // get multiple students data given an array of student document references
  // @param studentRefs: DocumentReference[]
  getStudentsData(studentRefs: DocumentReference[]) {
    const studentData = [];
    studentRefs.forEach((ref) => {
      ref.get().then((doc) => {
        studentData.push({ name: doc.data().name, uid: doc.data().uid });
      });
    });

    return studentData;
  }

  // get multiple students data with an array of student UIDs
  // @param studentUID: string[]
  async getStudentsDataByID(studentUID: string[]): Promise<any[]> {
    const studentData = [];
    for (const uid of studentUID) {
      const doc = await this.userCollection.doc(uid).get();
      studentData.push({ name: doc.data().name, uid: doc.data().uid });
    }
    return studentData;
  }

  // get an individual student's data with a documentReference
  // @param ref: DocumentReference
  getStudentData(ref: DocumentReference): Promise<any> {
    const promise = ref.get().then((doc) => {
      return doc.data();
    });
    return promise;
  }

  //  helper method for getting length of array
  getLengthOf(array: any[]) {
    if (array == null) {
      return 0;
    }
    return array.length;
  }

  // given an array of student document references get the student data for each ref.
  // @param refs: DocumentReference[]
  async getStudentsDataByReference(refs: DocumentReference[]): Promise<any> {
    const studentsData: StudentData[] = [];
    for (const studentRef of refs) {
      const student = await this.getStudentData(studentRef);
      const data: StudentData = {
        name: student.name,
        goalsAssigned: this.getLengthOf(student.goalsAssigned),
        goalsCompleted: this.getLengthOf(student.goalsCompleted),
        id: studentRef.id,
      } as StudentData;
      studentsData.push(data);
    }
    return studentsData;
  }

  // get a user's class using their uid
  // @param userID: string
  getClasses(userID: string): Class[] {
    const classes: Class[] = [];
    console.log('getting classes for user');
    this.userCollection
      .doc(userID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          doc.data().classes.forEach((ref) => {
            ref.get().then((paper) => classes.push(paper.data()));
          });
        }
      })
      .catch((err) => console.log(err));
    return classes;
  }

  // get a teacher;s class with their uid and the class id
  // @param teacherUID: string, classID: string
  getClass(teacherUID: string, classID: string): Promise<any> {
    const promise = this.classCollection
      .doc(classID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log('No such document or inavlid teacher uid!');
          return null;
        }
      });
    return promise;
  }
}
