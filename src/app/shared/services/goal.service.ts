import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Goal } from '../models/goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  constructor(private afs: AngularFirestore) { }

  getGoalsForClass(classID: string): Promise<any>{
    let goals: Goal[] = [];
    let promise = this.afs.firestore.collection("goals").where('classID', '==', classID).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        goals.push({description: doc.data().description, dueDate: doc.data().dueDate, id: doc.id, createdBy: doc.data().createdBy, hasCompleted: doc.data().hasCompleted, classID: doc.data().classID,
          assignedToID: doc.data().assignedToID, assignedTo: doc.data().assignedTo});
      })
      return goals;
    })
    return promise;
  }

  getGoalsForClassWithId(classID: string, userID: string): Promise<any>{
    let goals: Goal[] = [];
    let promise = this.afs.firestore.collection("goals").where('classID', '==', classID).where('assignedToID', 'array-contains', userID).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        goals.push({description: doc.data().description, dueDate: doc.data().dueDate, id: doc.id, createdBy: doc.data().createdBy, hasCompleted: doc.data().hasCompleted,
          classID: doc.data().classID, assignedToID: doc.data().assignedToID, assignedTo: doc.data().assignedTo});
      })
      return goals;
    })
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
      let ref = this.afs.firestore.collection("goals").doc(goal.id);
      this.afs.firestore.collection("users").doc(uid).update({goalsCompleted: firebase.firestore.FieldValue.arrayUnion(ref)});
    }).catch(err => console.log(err));

    return promise;
  }

  unsubmitGoal(goal: Goal, uid:string): Promise<any>{
    goal.hasCompleted = goal.hasCompleted.filter(item => item !== uid);
    let promise = this.afs.doc<Goal>(`goals/` + goal.id).set(goal).then(() => {
      let ref = this.afs.firestore.collection("goals").doc(goal.id);
      this.afs.firestore.collection("users").doc(uid).update({goalsCompleted: firebase.firestore.FieldValue.arrayRemove(ref)});
    }).catch(err => console.log(err));

    return promise;
  }


}
