import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import GoalClass from 'src/app/shared/models/goal';
import { GoalService } from 'src/app/shared/services/goal.service';

@Component({
  selector: 'gms-delete-goal',
  templateUrl: './delete-goal.component.html',
  styleUrls: ['./delete-goal.component.scss']
})
export class DeleteGoalComponent {
  goal: GoalClass;
  editDate: Date;
  loading: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private goalService: GoalService,
  public dialogRef: MatDialogRef<DeleteGoalComponent>) {

    this.editDate = new Date(data.dueDate.seconds * 1000);

    this.goal = new GoalClass(data.description, this.editDate, data.classID, data.hasCompleted, data.pending, data.declined,
      data.id, data.createdBy, data.assignedToID);
  }

  deleteGoal(){
    this.loading = true;
    this.goalService.deleteGoal(this.goal).then(() => {
      this.loading = false;
      this.dialogRef.close('success');
    })
  }

}
