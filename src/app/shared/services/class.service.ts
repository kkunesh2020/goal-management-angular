import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  CollectionReference,
  DocumentReference,
} from '@angular/fire/firestore';
import { StudentData } from 'src/app/teacher/class/class.component';
import ClassClass from '../models/class';
import { Class } from '../models/class.model';
import DirectorClassClass from '../models/directorClass';
import { DirectorClass } from '../models/directorClass.model';
import UserClass from '../models/user';
import { User } from '../models/user.model';

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
    let classes: Class[] = [];
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

  getClassDataForDirector(id: string): Promise<DirectorClass>{
    let returnData = null;
    let promise = this.classCollection.doc(id).get().then((data) => {
      returnData = {...data.data(), id: data.id} as DirectorClass;
      return returnData;
    })
    return promise;
  }

  getClassesByEmail(email: string): Class[]{
    let classes: Class[] = [];
    this.classCollection.where("studentEmails", "array-contains", email).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        classes.push({...doc.data(), id: doc.id} as Class);
      })
    })
    return classes;
  }

  // get a teachers class with their uid and the class id
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

  createClassFromDirectorModel(classData: DirectorClass): Promise<any>{
     const promise = this.classCollection.add({members: classData.members, title: classData.title, teacherUID: classData.teacherUID, students: classData.students, studentEmails: classData.studentEmails, goals: [], classIcon: classData.classIcon});
     return promise;
  }

  getAllTeachers(): Promise<User[]>{
    let teachers : User[] = [];
    const promise = this.userCollection.where("isAdmin", "==", true).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log("teacher", doc.data());
        teachers.push(doc.data() as User);
      })
      return teachers;
    })
    return promise;
  }

   // get all classes from the collection
  getAllClasses(): Promise<Class[]> {
    const promise = this.classCollection
      .get()
      .then((collection) => {
        const data = [];
        collection.forEach((doc) => {
          let classData: DirectorClass = new DirectorClassClass(doc.data().members, doc.data().title, doc.data().teacherUID, doc.data().students, doc.id, doc.data().studentEmails, doc.data().classIcon);
          data.push(classData);
        })
        return data;
      });
    return promise;
  }
}
