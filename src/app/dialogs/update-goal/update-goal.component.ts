import {Component, Inject, OnInit} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Goal } from '../../shared/models/goal.model';

@Component({
  selector: 'gms-update-goal',
  templateUrl: './update-goal.component.html',
  styleUrls: ['./update-goal.component.scss']
})
export class UpdateGoalComponent implements OnInit{
  madeChanges:boolean = false;
  isLoading:boolean = false;
  original: Goal;
  currentGoal: Goal;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<UpdateGoalComponent>, private afs: AngularFirestore) {
    this.currentGoal = data;
    this.original = data;
   }
  ngOnInit(): void {

  }

  updateGoal(isDone){
    this.currentGoal.isCompleted = isDone;
    this.madeChanges = true;
  }


  saveChanges(){
    this.isLoading = true;
    console.log(this.currentGoal.id);

    this.afs.doc<Goal>(`goals/` + this.currentGoal.id).set(this.currentGoal).then(() => {
      this.isLoading = false;
      this.madeChanges = true;
      this.dialogRef.close();
    }).catch(err => console.log(err));
  }


}
