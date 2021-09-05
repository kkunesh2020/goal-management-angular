import { Component, Inject, Optional } from '@angular/core';
import GoalClass from 'src/app/shared/models/goal';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GoalService } from 'src/app/shared/services/goal.service';
import { NbDialogRef, NbDialogService } from '@nebular/theme';

@Component({
  selector: 'gms-create-student-goal',
  templateUrl: './create-student-goal.component.html',
  styleUrls: ['./create-student-goal.component.scss'],
})
export class CreateStudentGoalComponent {
  goal: GoalClass;
  loading = false;
  dateErrors: string = "";

  constructor(
    private dialogService: NbDialogService,
    private goalService: GoalService,
    @Optional() protected ref: NbDialogRef<CreateStudentGoalComponent>
  ) {
  }

  formComplete(): boolean {
    return this.goal.description.trim() !== '' && this.goal.dueDate != null && this.goal.description.length <= 40 && !this.checkDateErrors();
  }

  closeDialog(){
    this.ref.close();
  }

  checkDateErrors(): boolean {
    if(this.goal.dueDate){
      let beforeDateOffset = new Date(this.goal.dueDate.getTime() + (24*60*60*1000));
      let afterDateOffset = new Date(this.goal.dueDate.getTime() - (24*60*60*1000 * 14));
      if (beforeDateOffset < new Date()) {
        this.dateErrors = "Due date cannot be before or during today";
        return true;
      }else if(afterDateOffset > new Date()){
        this.dateErrors = "Due date must be within 2 weeks";
        return true;
      }
    }
    return false;
  }

  createGoal() {
    this.loading = true;
    this.goal.description = this.goal.description.trim();
    this.goalService.createGoal(this.goal).then(() => {
      this.loading = false;
      this.ref.close('success');
    });
  }
}
