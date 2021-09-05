import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import GoalClass from 'src/app/shared/models/goal';
import { GoalService } from 'src/app/shared/services/goal.service';
import { NbDialogRef, NbDialogService } from '@nebular/theme';


@Component({
  selector: 'gms-delete-goal',
  templateUrl: './delete-goal.component.html',
  styleUrls: ['./delete-goal.component.scss'],
})
export class DeleteGoalComponent implements OnInit{
  goal: GoalClass;
  editDate: Date;
  public data: any;
  loading: boolean;

  constructor(
    private goalService: GoalService,
    @Optional() protected dialogRef: NbDialogRef<DeleteGoalComponent>
  ) {
  }

  ngOnInit(){
    this.editDate = new Date(this.data.dueDate.seconds * 1000);

    this.goal = new GoalClass(
      this.data.teacherEmail,
      this.data.description,
      this.editDate,
      this.data.classID,
      this.data.hasCompleted,
      this.data.pending,
      this.data.declined,
      this.data.id,
      this.data.createdBy,
      this.data.assignedToID
    );
  }

  deleteGoal() {
    this.loading = true;
    this.goalService.deleteGoal(this.goal).then(() => {
      this.loading = false;
      this.dialogRef.close('success');
    });
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
