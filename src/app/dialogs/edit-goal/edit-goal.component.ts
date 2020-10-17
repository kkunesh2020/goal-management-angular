import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GoalService } from 'src/app/shared/services/goal.service';

@Component({
  selector: 'gms-edit-goal',
  templateUrl: './edit-goal.component.html',
  styleUrls: ['./edit-goal.component.scss']
})
export class EditGoalComponent implements OnInit {

  loading: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private goalService: GoalService,
  public dialogRef: MatDialogRef<EditGoalComponent>) { }

  ngOnInit() {
  }

  deleteGoal(){
    this.loading = true;
    this.goalService.deleteGoal(this.data).then(() => {
      this.loading = false;
      this.dialogRef.close('success');
    })
  }
}
