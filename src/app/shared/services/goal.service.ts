import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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


}
