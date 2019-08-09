import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Goal } from '../models/goal.model';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { TestUtils } from '../utils/test-utils';
import { Utils } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  /**
   * Sets the global variables to the data from the firestore database.
   * @param afs the firestore database
   */
  constructor(private readonly afs: AngularFirestore) {}

  async getTodaysGoal(student: User): Promise<Goal> {
    const todayDate = Utils.getSimplifiedDate(new Date());
    const query = this.afs.collection<Goal>('goals').ref
        .where('assignedTo', '==', student.uid)
        // .where('dueDate', '==', todayDate)
        .limit(1);

    let result;
    await query.get().then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents');
          return;
        }

        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          result = doc.data() as Goal;
        });
      });
    return result;
  }
}
