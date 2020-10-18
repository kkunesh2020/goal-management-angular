import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { GoalStat } from 'src/app/teacher/class/class.component';
import { Goal } from '../models/goal.model';
import GoalClass from 'src/app/shared/models/goal';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  goalsCollection: CollectionReference;
  usersCollection: CollectionReference;

  constructor(private afs: AngularFirestore) {
    this.goalsCollection = this.afs.firestore.collection("goals");
    this.usersCollection = this.afs.firestore.collection("users");
   }



  getGoalsForClass(classID: string): Promise<any>{
    let goals: Goal[] = [];
    let promise = this.goalsCollection.where('classID', '==', classID).get().then(querySnapshot => {
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
    let promise = this.goalsCollection.where('classID', '==', classID).where('assignedToID', 'array-contains', userID).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        goals.push({description: doc.data().description, dueDate: doc.data().dueDate, id: doc.id, createdBy: doc.data().createdBy, hasCompleted: doc.data().hasCompleted,
          classID: doc.data().classID, assignedToID: doc.data().assignedToID});
      })
      return goals;
    })
    return promise;
  }

  getGoalById(goalID: string): Promise<any>{
    let promise = this.goalsCollection.doc(goalID).get().then(doc => {return doc;}).catch(err => {console.log(err)});
    return promise;
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

  createGoal(goal: Goal): Promise<any>{
    let promise = this.goalsCollection.add({...goal}).catch(err => console.log(err));
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
    let promise = this.goalsCollection.doc(goal.id).set(goal).then(() => {return;})
    .catch(err => console.log(err));
    return promise;
  }


}
