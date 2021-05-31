import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  CollectionReference,
  DocumentReference,
} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
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
          doc.data().accountType,
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

  getStudentDataByEmail(email: string): Promise<any>{
    const promise = this.userCollection.where('email', '==', email).get().then((doc) => {
      return doc.docs[0];
    });
    return promise;
  }

  getDataForClass(classID: string): Observable<DirectorClass | undefined> {
    let doc = this.afs.collection("classes").doc<DirectorClass>(classID).valueChanges();
    return doc;
  }


  //  helper method for getting length of array
  getLengthOf(array: any[]) {
    if (array == null) {
      return 0;
    }
    return array.length;
  }

  getGoalByReference(doc: DocumentReference): Promise<any> {
    const promise = doc.get().then((paper) => {
      return {...paper.data(), id: paper.id};
    });
    return promise;
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
        uid: studentRef.id,
        email: student.email
      } as StudentData;

      studentsData.push(data);
    }
    return studentsData;
  }

  async getStudentsDataByEmail(emails: string[]): Promise<any>{
    const studentsData: StudentData[] = [];
    for (const email of emails) {
      const student = await this.getStudentDataByEmail(email);
      let studentData = student.data();
      const data: StudentData = {
        name: studentData.name,
        goalsAssigned: this.getLengthOf(studentData.goalsAssigned),
        goalsCompleted: this.getLengthOf(studentData.goalsCompleted),
        id: student.id,
        uid: student.id,
        email: studentData.email
      } as StudentData;

      studentsData.push(data);
    }
    return studentsData;
  }

  async getStudentsDataByReferenceClassID(refs: DocumentReference[], classID: string): Promise<any> {
    const studentsData: StudentData[] = [];
    for (const studentRef of refs) {
      const student = await this.getStudentData(studentRef);
      let assignmentCount = 0;
      let completedCount = 0;
      for await(let assignement of student.goalsAssigned) {
        let result = await this.getGoalByReference(assignement);
        if(result.classID == classID){
          assignmentCount++;
        }

        if(result.classID == classID && result.hasCompleted.includes(student.email)){
          completedCount++;
        }
      }    
      const data: StudentData = {
        name: student.name,
        goalsAssigned: assignmentCount,
        goalsCompleted: completedCount,
        id: studentRef.id,
        uid: studentRef.id,
        email: student.email
      } as StudentData;
      
      studentsData.push(data);
    }
    return studentsData;
  }

  async getStudentsDataByEmailClassID(emails: string[], classID: string): Promise<any> {
    const studentsData: StudentData[] = [];
    for (const email of emails) {
      const student = await this.getStudentDataByEmail(email);
      const studentData = student.data();
      let assignmentCount = 0;
      let completedCount = 0;
      for await(let assignement of studentData.goalsAssigned) {
        let result = await this.getGoalByReference(assignement);
        if(result.classID == classID){
          assignmentCount++;
        }

        if(result.classID == classID && result.hasCompleted.includes(student.id)){
          completedCount++;
        }
      }    
      const data: StudentData = {
        name: studentData.name,
        goalsAssigned: assignmentCount,
        goalsCompleted: completedCount,
        id: student.id,
        uid: student.id,
        email: studentData.email
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
            ref.get().then((paper) => classes.push({ id: paper.id, ...paper.data() }));
          });
        }
      })
      .catch((err) => console.log(err));
    return classes;
  }

  getClassDataForDirector(id: string): Promise<DirectorClass> {
    let returnData = null;
    let promise = this.classCollection.doc(id).get().then((data) => {
      returnData = { ...data.data(), id: data.id } as DirectorClass;
      return returnData;
    })
    return promise;
  }

  getClassesByEmail(email: string): Class[] {
    let classes: Class[] = [];
    this.classCollection.where("studentEmails", "array-contains", email).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        classes.push({ ...doc.data(), id: doc.id } as Class);
      })
    })
    return classes;
  }

  getTeacherData(teacherEmail: string): Promise<any> {
    const promise = this.userCollection.doc(teacherEmail).get().then((teacherDoc) => {
      let teacherUser = { id: teacherDoc.id, ...teacherDoc.data() };
      return teacherUser;
    })
    return promise;
  }

  // get a teachers class with their uid and the class id
  // @param teacherEmail: string, classID: string
  getClass(teacherEmail: string, classID: string): Promise<any> {
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


  async updateClassForDirector(classData: DirectorClass): Promise<any> {
    const promise = this.classCollection.doc(classData.id).update({ teacherEmail: classData.teacherEmail, title: classData.title, classIcon: classData.classIcon });
    return promise;
  }

  async updateTeacherForDirector(classData: DirectorClass, teacherData: User, oldteacherEmail: string){
    // remove old teacher
    await this.userCollection.doc(oldteacherEmail).update({
      classes: firebase.firestore.FieldValue.arrayRemove(this.classCollection.doc(classData.id))
    })
    // update new teacher
    await this.userCollection.doc(teacherData.email).update({
      classes: firebase.firestore.FieldValue.arrayUnion(this.classCollection.doc(classData.id))
    })
    return;
  }

  async deleteClassFromStudent(studentID: string, classID: string): Promise<any> {
    console.log("DELETING", studentID)
    let promise = this.userCollection.doc(studentID).update({
      classes: firebase.firestore.FieldValue.arrayRemove(this.classCollection.doc(classID)),
    })
    return promise;
  }

  deleteStudentFromClass(classData: DirectorClass, studentData: any): Promise<any> {
    const promise = new Promise(async (resolve, reject) => {
      await this.userCollection.doc(studentData.email).update({
        classes: firebase.firestore.FieldValue.arrayRemove(this.classCollection.doc(classData.id))
      })

      resolve(studentData);
    })
    return promise;
  }

  async deleteClassForDirector(classData: DirectorClass) {
    // delete class from every student
    if (classData.students.length > 0) {
      console.log("deleting student data....");
      this.getStudentsDataByReference(classData.students).then(async (students) => {
        console.log("looping throught students", students);
        students.forEach(async (student) => {
          console.log("DELETING", student);
          await this.deleteStudentFromClass(classData, student);
        })
      })
    }
    this.classCollection.doc(classData.id).delete().then(() => {
      return;
    });
  }

  async createClassFromDirectorModel(classData: DirectorClass): Promise<string> {
    const promise = this.classCollection.add({ title: classData.title, teacherEmail: classData.teacherEmail, students: classData.students, goals: [], classIcon: classData.classIcon })
      .then(async(doc) => {
        await this.userCollection.doc(classData.teacherEmail).update({ classes: firebase.firestore.FieldValue.arrayUnion(this.classCollection.doc(doc.id)) });
        return doc.id;
      });
    return promise;
  }

  getAllTeachers(): Promise<User[]> {
    let teachers: User[] = [];
    const promise = this.userCollection.where("accountType", "==", "teacher").get().then((snapshot) => {
      snapshot.forEach((doc) => {
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
          let classData: DirectorClass = new DirectorClassClass(doc.data().title, doc.data().teacherEmail, doc.data().students, doc.id, doc.data().classIcon);
          data.push(classData);
        })
        return data;
      });
    return promise;
  }
}
