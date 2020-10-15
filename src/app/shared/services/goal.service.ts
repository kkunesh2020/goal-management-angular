import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Goal } from '../models/goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  constructor(private afs: AngularFirestore) { }

  getGoalsForClass(classID: string, userID: string): Promise<any>{
    let goals: Goal[] = [];
    let promise = this.afs.firestore.collection("goals").where('classID', '==', classID).where('assignedToID', 'array-contains', userID).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        console.log("got the goal", doc.data());
        goals.push({description: doc.data().description, dueDate: doc.data().dueDate, id: doc.id, createdBy: doc.data().createdBy, isCompleted: doc.data().isCompleted, classID: doc.data().classID, assignedToID: doc.data().assignedToID, assignedTo: doc.data().assignedTo});
      })
      return goals;
    })
    return promise;
  }
}
