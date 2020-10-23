import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { GoalsTableData, GoalStat } from 'src/app/teacher/class/class.component';
import { Goal } from '../models/goal.model';
import GoalClass from 'src/app/shared/models/goal';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  goalsCollection: CollectionReference;
  usersCollection: CollectionReference;
  filesCollection: CollectionReference;

  constructor(private afs: AngularFirestore) {
    this.goalsCollection = this.afs.firestore.collection("goals");
    this.usersCollection = this.afs.firestore.collection("users");
    this.filesCollection = this.afs.firestore.collection("files");
   }



  getGoalsForClass(classID: string): Promise<any>{
    let goals: Goal[] = [];
    let promise = this.goalsCollection.where('classID', '==', classID).orderBy('dueDate', "desc").get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        goals.push({description: doc.data().description, dueDate: doc.data().dueDate, id: doc.id, createdBy: doc.data().createdBy, hasCompleted: doc.data().hasCompleted,
          classID: doc.data().classID, assignedToID: doc.data().assignedToID});
      })
      return goals;
    })
    return promise;
  }

  getGoalsForClassWithId(classID: string, userID: string): Promise<any>{
    let goals: Goal[] = [];
    let promise = this.goalsCollection.where('classID', '==', classID).where('assignedToID', 'array-contains', userID).orderBy('dueDate', "desc").get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        goals.push({description: doc.data().description, dueDate: doc.data().dueDate, id: doc.id, createdBy: doc.data().createdBy, hasCompleted: doc.data().hasCompleted,
          classID: doc.data().classID, assignedToID: doc.data().assignedToID});
      })
      return goals;
    })
    return promise;
  }

  getGoalById(goalID: string): Promise<any>{
    let promise = this.goalsCollection.doc(goalID).get().then(doc => {return doc.data();}).catch(err => {console.log(err)});
    return promise;
  }

  getGoalsById(goalIDs: DocumentReference[], uid: string): Observable<any>{
    let goals: GoalsTableData[] = [];
    goalIDs.forEach(goal => {
      this.goalsCollection.doc(goal.id).get().then(doc => {
        let goalRef = {
          description: doc.data().description,
          dueDate: doc.data().dueDate,
          hasCompleted: doc.data().hasCompleted,
          createdBy: doc.data().createdBy,
          assignedToID: doc.data().assignedToID,
          id: doc.data().id,
          classID: doc.data().classID} as Goal;

        goals.push({description: goalRef.description,
          dueDate: goalRef.dueDate,
          isCompleted: this.userHasCompleted(goalRef.hasCompleted, uid),
          createdBy: doc.data().createdBy,
          goalReference: goalRef});
      });
    });
    return of(goals);
  }

  getGoalByReference(doc: DocumentReference): Promise<any>{
    let promise = doc.get().then(doc => {return doc;});
    return promise;
  }

  userHasCompleted(completedUsersID: string[], userID: string){
    console.log("completedUsersID", completedUsersID);
    console.log("userID", userID);
    if(completedUsersID == null) { return false; }
    if(completedUsersID.includes(userID)) {
      return true;
    }else{
      return false;
    }
  }

  assignGoal(goal: Goal, uid:string): Promise<any>{
    let promise = this.afs.doc<Goal>(`goals/` + goal.id).set(goal).then(() => {
      this.afs.firestore.collection("users").doc(uid).update({goalsAssigned: firebase.firestore.FieldValue.arrayUnion(goal)})
    }).catch(err => console.log(err));
    return promise;
  }

  completeGoal(goal: Goal, uid:string): Promise<any>{
    if(goal.hasCompleted == null){
      goal.hasCompleted = [uid];
    }else{
      goal.hasCompleted.push(uid);
    }

    let promise = this.afs.doc<Goal>(`goals/` + goal.id).set(goal).then(() => {
      let ref = this.goalsCollection.doc(goal.id);
      this.afs.firestore.collection("users").doc(uid).update({goalsCompleted: firebase.firestore.FieldValue.arrayUnion(ref)});
    }).catch(err => console.log(err));

    return promise;
  }

  unsubmitGoal(goal: Goal, uid:string): Promise<any>{
    goal.hasCompleted = goal.hasCompleted.filter(item => item !== uid);
    let promise = this.afs.doc<Goal>(`goals/` + goal.id).set(goal).then(() => {
      let ref = this.goalsCollection.doc(goal.id);
      this.afs.firestore.collection("users").doc(uid).update({goalsCompleted: firebase.firestore.FieldValue.arrayRemove(ref)});
    }).catch(err => console.log(err));

    return promise;
  }

  assignToStudents(goalID: string, studentID: string[]): void{
    let goalRef: DocumentReference = this.goalsCollection.doc(goalID);
    studentID.forEach(id => {
      this.usersCollection.doc(id).update({goalsAssigned: firebase.firestore.FieldValue.arrayUnion(goalRef)})
    })
  }

  uploadFile(goalID: string, fileData: any){
    let goalRef = this.goalsCollection.doc(goalID);
    this.filesCollection.add(fileData).then((docRef) => {
      let fileRef: DocumentReference = this.filesCollection.doc(docRef.id);
      goalRef.update({files: firebase.firestore.FieldValue.arrayUnion(fileRef)});
    });
  }

  createGoal(goal: GoalClass): Promise<any>{
    console.log("assigned to student ids", goal.assignedToID);
    let promise = this.goalsCollection.add({...goal}).then((docRef) => {
      this.assignToStudents(docRef.id, goal.assignedToID);
      return;
    }).catch(err => console.log(err));
    return promise;
  }

  deleteGoal(goalData: GoalClass): Promise<any>{
    console.log("gottem goalData", goalData);
    // remove goal from student assignedGoals field
    const goalRef = this.goalsCollection.doc(goalData.id);
    goalData.assignedToID.forEach(studentID => {
      this.usersCollection.doc(studentID).update({goalsAssigned: firebase.firestore.FieldValue.arrayRemove(goalRef)});
    });
    // remove goal from student goalsCompleted field
    goalData.hasCompleted.forEach(studentID => {
      this.usersCollection.doc(studentID).update({goalsCompleted: firebase.firestore.FieldValue.arrayRemove(goalRef)});
    })

    //remove doc from goal collection
    let promise = goalRef.delete().then(() => {return;}).catch(err => console.log(err));
    return promise;
  }

  editGoal(goal: GoalClass): Promise<any>{
    let promise = this.goalsCollection.doc(goal.id).set({...goal}).catch(err => console.log(err));
    return promise;
  }


}
