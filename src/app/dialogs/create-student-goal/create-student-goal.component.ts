import { Component, Inject } from '@angular/core';
import GoalClass from 'src/app/shared/models/goal';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GoalService } from 'src/app/shared/services/goal.service';

@Component({
  selector: 'gms-create-student-goal',
  templateUrl: './create-student-goal.component.html',
  styleUrls: ['./create-student-goal.component.scss'],
})
export class CreateStudentGoalComponent {
  goal: GoalClass;
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private goalService: GoalService,
    public dialogRef: MatDialogRef<CreateStudentGoalComponent>
  ) {
    this.goal = new GoalClass(
      '',
      null,
      data.classID,
      [],
      [],
      [],
      '',
      data.createdBy,
      [data.createdBy.uid]
    );
  }

  formComplete(): boolean {
    return this.goal.description !== '' && this.goal.dueDate != null;
  }

  createGoal() {
    this.loading = true;
    console.log(this.goal.assignedToID);
    this.goalService.createGoal(this.goal).then(() => {
      this.loading = false;
      this.dialogRef.close('success');
    });
  }
}
