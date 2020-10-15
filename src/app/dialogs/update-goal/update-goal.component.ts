import {Component, Inject} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Goal } from '../../shared/models/goal.model';

@Component({
  selector: 'gms-update-goal',
  templateUrl: './update-goal.component.html',
  styleUrls: ['./update-goal.component.scss']
})


export class UpdateGoalComponent{
  madeChanges:boolean = false;
  isLoading:boolean = false;
  currentGoal: Goal;
  isCompleted: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<UpdateGoalComponent>, private afs: AngularFirestore) {
    this.currentGoal = {description: data.description, dueDate: data.dueDate, hasCompleted: data.hasCompleted, createdBy: data.createdBy,
      assignedToID: data.assignedToID, id: data.id, classID: data.classID};
    this.isCompleted = data.isCompleted;
   }


  updateGoal(isDone){
    console.log(this.currentGoal, "current goal");
    if(isDone){
      if(this.currentGoal.hasCompleted == null){
        this.currentGoal.hasCompleted = [this.data.uid];
      }else{
        this.currentGoal.hasCompleted.push(this.data.uid);
      }
    }else{
      this.currentGoal.hasCompleted = this.currentGoal.hasCompleted.filter(item => item !== this.data.uid);
    }
    this.madeChanges = true;
    this.isLoading = true;
    this.afs.doc<Goal>(`goals/` + this.currentGoal.id).set(this.currentGoal).then(() => {
      this.isLoading = false;
      this.madeChanges = true;
      this.dialogRef.close();
    }).catch(err => console.log(err));
  }


}
