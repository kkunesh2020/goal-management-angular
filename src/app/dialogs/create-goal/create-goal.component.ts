import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GoalService } from 'src/app/shared/services/goal.service';
import { StudentData } from 'src/app/teacher/class/class.component';
import GoalClass from '../../shared/models/goal';

@Component({
  selector: 'gms-create-goal',
  templateUrl: './create-goal.component.html',
  styleUrls: ['./create-goal.component.scss']
})

export class CreateGoalComponent implements OnInit {
  goal: GoalClass;
  loading = false;
  assignedStudentID: string[] = [];
  assignedToAll: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private goalService: GoalService,
              public dialogRef: MatDialogRef<CreateGoalComponent>) {
    this.goal = new GoalClass('', null, data.classID, [], [], [], '', data.createdBy, []);

   }

  ngOnInit() {
  }

  assignAllStudents() {
    console.log("data", this.data);
    this.assignedStudentID = [];
    this.data.students.forEach(student => {
      this.assignedStudentID.push(student.uid);
    });
  }


  formComplete(): boolean {
    return this.assignedStudentID.length > 0 && this.goal.description !== '' && this.goal.dueDate != null;
  }

  checkSpecific(studentID: string, assigned: boolean) {
    if (assigned) {
      this.assignedStudentID.push(studentID);
    } else { // removes from assigned student array
      this.assignedStudentID = this.assignedStudentID.filter(id => id != studentID);
    }
  }

  resetList() {
    this.assignedToAll = false;
    console.log(this.assignedToAll);
    this.assignedStudentID = [];
  }


  createGoal() {
    this.loading = true;
    this.goal.assignedToID = this.assignedStudentID;
    this.goal.pending = this.assignedStudentID;
    console.log(this.goal.assignedToID);
    this.goalService.createGoal(this.goal).then(() => {
      this.loading = false;
      this.dialogRef.close('success');
    });
  }


}
