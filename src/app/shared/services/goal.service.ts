import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { GoalsTableData, GoalStat } from 'src/app/teacher/class/class.component';
import { Goal } from '../models/goal.model';
import GoalClass from 'src/app/shared/models/goal';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { User } from '../models/user.model';
import FileClass from '../models/file';
import { File } from '../models/file.model';
import { AngularFireStorage } from '@angular/fire/storage';
import LinkClass from '../models/link';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  goalsCollection: CollectionReference;
  usersCollection: CollectionReference;
  filesCollection: CollectionReference;

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) {
    this.goalsCollection = this.afs.firestore.collection('goals');
    this.usersCollection = this.afs.firestore.collection('users');
    this.filesCollection = this.afs.firestore.collection('files');
   }



  getGoalsForClass(classID: string): Promise<any> {
    let goals: Goal[] = [];
    let promise = this.goalsCollection.where('classID', '==', classID).orderBy('dueDate', 'desc').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        goals.push(new GoalClass(doc.data().description, doc.data().dueDate, doc.data().classID, doc.data().hasCompleted, doc.data().pending, doc.data().declined, doc.id,
        doc.data().createdBy, doc.data().assignedToID, doc.data().files, doc.data().links));
      });
      return goals;
    });
    return promise;
  }

  getGoalsForClassWithId(classID: string, userID: string): Promise<any> {
    let goals: Goal[] = [];
    let promise = this.goalsCollection.where('classID', '==', classID).where('assignedToID', 'array-contains', userID)
    .orderBy('dueDate', 'desc').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        goals.push(new GoalClass(doc.data().description, doc.data().dueDate, doc.data().classID, doc.data().hasCompleted, doc.data().pending, doc.data().declined, doc.id,
        doc.data().createdBy, doc.data().assignedToID, doc.data().files, doc.data().links));
      });
      return goals;
    });
    return promise;
  }

  getGoalById(goalID: string): Promise<any> {
    console.log('gettng goal by id', goalID);
    let promise = this.goalsCollection.doc(goalID).get().then(doc => {return doc.data(); }).catch(err => {console.log(err);});
    return promise;
  }

  getGoalsById(goalIDs: DocumentReference[], uid: string): Observable<any> {
    let goals: GoalsTableData[] = [];
    goalIDs.forEach(goal => {
      this.goalsCollection.doc(goal.id).get().then(doc => {
        let goalRef = new GoalClass(doc.data().description, doc.data().dueDate, doc.data().classID, doc.data().hasCompleted, doc.data().pending, doc.data().declined, doc.id,
        doc.data().createdBy, doc.data().assignedToID, doc.data().files, doc.data().links);

        let status = this.getUserStatus(goalRef.hasCompleted, goalRef.pending, goalRef.declined, uid);
        goals.push({description: goalRef.description,
          dueDate: goalRef.dueDate,
          isCompleted: this.userHasCompleted(goalRef.hasCompleted, uid),
          createdBy: goalRef.createdBy.name,
          goalReference: goalRef, status: status});
      });
    });
    return of(goals);
  }

  getGoalByReference(doc: DocumentReference): Promise<any> {
    let promise = doc.get().then(doc => {return doc; });
    return promise;
  }

  getUserStatus(completedUsersID: string[], pendingUsersID: string[], declinedUsersID: string[], userID: string){

    if(completedUsersID != null){
      if(completedUsersID.includes(userID)){
        return "completed";
      }
    }
    
    if(declinedUsersID != null){
      if(declinedUsersID.includes(userID)){
        return "declined";
      }
    }
    
    if(pendingUsersID != null){
      if(pendingUsersID.includes(userID)){
        return "pending";
      }
    }
  
    return "incomplete";
  }

  userHasCompleted(completedUsersID: string[], userID: string) {
    console.log('completedUsersID', completedUsersID);
    console.log('userID', userID);
    if (completedUsersID == null) { return false; }
    if (completedUsersID.includes(userID)) {
      return true;
    } else {
      return false;
    }
  }

  assignGoal(goal: Goal, uid: string): Promise<any> {
    let promise = this.afs.doc<Goal>(`goals/` + goal.id).set(goal).then(() => {
      this.afs.firestore.collection('users').doc(uid).update({goalsAssigned: firebase.firestore.FieldValue.arrayUnion(goal)});
    }).catch(err => console.log(err));
    return promise;
  }

  completeGoal(goal: Goal, uid: string): Promise<any> {
    goal = this.validateGoal(goal);
    if (goal.hasCompleted == null) {
      goal.hasCompleted = [uid];
    } else {
      goal.hasCompleted.push(uid);
    }

    if (goal.files == null) {
      goal.files = [];
    } else {
      goal.files = goal.files.map((file) => Object.assign({}, file));
    }

    let promise = this.afs.doc<Goal>(`goals/` + goal.id).set({...goal}).then(() => {
      let ref = this.goalsCollection.doc(goal.id);
      this.afs.firestore.collection('users').doc(uid).update({goalsCompleted: firebase.firestore.FieldValue.arrayUnion(ref)});
    }).catch(err => console.log(err));

    return promise;
  }

  validateGoal(goal: Goal){
    if(goal.files == null){
      goal.files = [];
    }

    if(goal.links == null){
      goal.links = [];
    }

    if(goal.assignedToID == null){
      goal.assignedToID = [];
    }

    if(goal.hasCompleted == null){
      goal.hasCompleted = [];
    }

    if(goal.declined == null){
      goal.declined = [];
    }

    if(goal.pending == null){
      goal.pending = [];
    }

    return goal;
  }

  unsubmitGoal(goal: Goal, uid: string): Promise<any> {
    goal = this.validateGoal(goal);
    goal.hasCompleted = goal.hasCompleted.filter(item => item !== uid);
    let promise = this.afs.doc<Goal>(`goals/` + goal.id).set(goal).then(() => {
      let ref = this.goalsCollection.doc(goal.id);
      this.afs.firestore.collection('users').doc(uid).update({goalsCompleted: firebase.firestore.FieldValue.arrayRemove(ref)});
    }).catch(err => console.log(err));

    return promise;
  }

  assignToStudents(goalID: string, studentID: string[]): void {
    let goalRef: DocumentReference = this.goalsCollection.doc(goalID);
    studentID.forEach(id => {
      this.usersCollection.doc(id).update({goalsAssigned: firebase.firestore.FieldValue.arrayUnion(goalRef)});
    });
  }

  uploadFile(goalID: string, fileData: FileClass) {
    let goalRef = this.goalsCollection.doc(goalID);
    this.filesCollection.add({...fileData}).then((docRef) => {
      goalRef.update({files: firebase.firestore.FieldValue.arrayUnion({...fileData})});
    });
  }

  updateGoalStatus(goalID: string, status: string, uid: string): Promise<any>{
    let goalRef = this.goalsCollection.doc(goalID);
    let promise: Promise<any>;
    console.log("updating goal status")
    if(status == "incomplete"){
      console.log("incomplete")
      promise = goalRef.update({pending: firebase.firestore.FieldValue.arrayRemove(uid)});
    }

    if(status == "declined"){
      console.log("declined")
      promise = goalRef.update({declined: firebase.firestore.FieldValue.arrayUnion(uid)}).then(() => {
        goalRef.update({pending: firebase.firestore.FieldValue.arrayRemove(uid)})
      });
    }

    if(status == "completed"){
      console.log("completed")
      promise = goalRef.update({hasCompleted: firebase.firestore.FieldValue.arrayUnion(uid)});
    }

    return promise;
  }

  createGoal(goal: GoalClass): Promise<any> {
    console.log('assigned to student ids', goal.assignedToID);
    if (goal.links == null) { goal.links = []; }
    if (goal.files == null) { goal.files = []; }
    let promise = this.goalsCollection.add({...goal}).then((docRef) => {
      this.assignToStudents(docRef.id, goal.assignedToID);
      return;
    }).catch(err => console.log(err));
    return promise;
  }

  deleteGoal(goalData: GoalClass): Promise<any> {
    console.log('gottem goalData', goalData);
    // remove goal from student assignedGoals field
    const goalRef = this.goalsCollection.doc(goalData.id);
    goalData.assignedToID.forEach(studentID => {
      this.usersCollection.doc(studentID).update({goalsAssigned: firebase.firestore.FieldValue.arrayRemove(goalRef)});
    });
    // remove goal from student goalsCompleted field
    goalData.hasCompleted.forEach(studentID => {
      this.usersCollection.doc(studentID).update({goalsCompleted: firebase.firestore.FieldValue.arrayRemove(goalRef)});
    });

    if (goalData.files != null) {
      goalData.files.forEach(file => {
        this.filesCollection.where('downloadURL', '==', file.downloadURL).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.filesCollection.doc(doc.id).delete();
            this.storage.ref(file.path).delete();
          });
        });
      });
   }

    //remove doc from goal collection
    let promise = goalRef.delete().then(() => {return; }).catch(err => console.log(err));
    return promise;
  }

  getFileID(fileDownloadURL: string): Promise<any> {
    console.log('getting file ID');
    return new Promise((resolve, reject) => {
      this.filesCollection.where('downloadURL', '==', fileDownloadURL).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log('got the document id: ', doc.id);
          resolve(doc.id);
        });
      });
    });
  }

  removeLinks(newLinks: LinkClass[], goalID: string): Promise<any> {
    let promise = this.goalsCollection.doc(goalID).update({links: newLinks}).then(() => {return; }).catch(err => {console.log(err); });
    return promise;
  }

  async deleteFileFromGoal(file: FileClass, goalID: string): Promise<any> {
    console.log('deleting the file', file);

    let fileID = await this.getFileID(file.downloadURL);
    console.log('the file ID: ', fileID);
      // delete from goal
    let promise = this.goalsCollection.doc(goalID).update({files: firebase.firestore.FieldValue.arrayRemove({...file})}).then(() => {
      // delete from storage
      this.storage.ref(file.path).delete();
      // delete from collection
      this.filesCollection.doc(fileID).delete().then(() => {return; }).catch(err => console.log(err));
    });
    return promise;
  }

  addLinkToGoal(goalID: string, link: LinkClass): Promise<any> {
    let promise = this.goalsCollection.doc(goalID).update({links: firebase.firestore.FieldValue.arrayUnion(link)}).then(() => {return; })
    .catch((err) => {
      console.log(err);
    });
    return promise;
  }

  editGoal(goal: GoalClass): Promise<any> {
    if (goal.files == null) { goal.files = []; }
    if (goal.links == null) { goal.links = []; }
    let promise = this.goalsCollection.doc(goal.id).set({...goal}).catch(err => console.log(err));
    return promise;
  }


}
