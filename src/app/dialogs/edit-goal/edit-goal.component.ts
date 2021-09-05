import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import GoalClass from 'src/app/shared/models/goal';
import { ClassService } from 'src/app/shared/services/class.service';
import { GoalService } from 'src/app/shared/services/goal.service';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
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
  dateErrors: string = "";
  public data: any;
  editDate: Date;

  constructor(
    private goalService: GoalService,
    @Optional() protected ref: NbDialogRef<EditGoalComponent>,
    private classService: ClassService
  ) {
  }

  ngOnInit() {
    // retrieve the data (class id, createdBy, assignedTo <= users)
    this.editDate = new Date(this.data.dueDate.seconds * 1000);
      this.original = this.data;

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

      this.classService
      .getStudentsDataByEmail(this.data.assignedToID)
      .then((studentsData) => {
        this.students = studentsData;
        this.assignedToAll = this.students.length === this.goal.assignedToID.length;
      });
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
      this.ref.close('success');
    });
  }

  checkDateErrors(): boolean {
    if(this.editDate){
      let beforeDateOffset = new Date(this.editDate.getTime() + (24*60*60*1000));
      let afterDateOffset = new Date(this.editDate.getTime() - (24*60*60*1000 * 14));
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

  closeDialog(){
    this.ref.close()
  }
}
