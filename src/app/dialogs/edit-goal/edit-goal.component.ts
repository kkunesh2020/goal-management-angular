import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import GoalClass from 'src/app/shared/models/goal';
import { ClassService } from 'src/app/shared/services/class.service';
import { GoalService } from 'src/app/shared/services/goal.service';
import { StudentData } from 'src/app/teacher/class/class.component';

@Component({
  selector: 'gms-edit-goal',
  templateUrl: './edit-goal.component.html',
  styleUrls: ['./edit-goal.component.scss'],
})
export class EditGoalComponent implements OnInit {
  goal: GoalClass;
  prevGoal: GoalClass;
  loading = false;
  assignedToAll = false;
  students: any[];
  original: any;
  public data: any;
  editDate: Date;

  constructor(
    private goalService: GoalService,
    public dialogRef: MatDialogRef<EditGoalComponent>,
    private classService: ClassService
  ) {
    this.editDate = new Date(this.data.dueDate.seconds * 1000);
    this.original = this.data;
    
    this.classService
      .getStudentsDataByEmail(this.data.assignedToID)
      .then((studentsData) => {
        this.students = studentsData;
        this.assignedToAll = this.students.length === this.goal.assignedToID.length;
      });

    // retrieve the data (class id, createdBy, assignedTo <= users)
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
      this.data.assignedToID,
      this.data.declinedMessages,
      this.data.files,
      this.data.links
    );
    this.prevGoal = this.goal;
  }

  ngOnInit() {
  }

  formComplete(): boolean {
    return (
      this.goal.assignedToID.length > 0 &&
      this.goal.description !== '' &&
      this.goal.dueDate != null
    );
  }

  editGoal() {
    this.goal.dueDate = this.editDate;
    if (this.goal.hasCompleted == null) {
      this.goal.hasCompleted = [];
    }
    this.loading = true;
    this.goalService.editGoal(this.goal, this.prevGoal).then(() => {
      this.loading = false;
      this.dialogRef.close('success');
    });
  }
}
