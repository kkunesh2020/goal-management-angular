import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import GoalClass from 'src/app/shared/models/goal';
import { ClassService } from 'src/app/shared/services/class.service';
import { GoalService } from 'src/app/shared/services/goal.service';
import { StudentData } from 'src/app/teacher/class/class.component';

@Component({
  selector: 'gms-edit-goal',
  templateUrl: './edit-goal.component.html',
  styleUrls: ['./edit-goal.component.scss']
})
export class EditGoalComponent implements OnInit {
  goal: GoalClass;
  prevGoal: GoalClass;
  loading: boolean = false;
  assignedToAll: boolean = false;
  students: any[];
  original: any;
  editDate: Date;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private goalService: GoalService,
  public dialogRef: MatDialogRef<EditGoalComponent>, private classService: ClassService) {

    this.editDate = new Date(data.dueDate.seconds * 1000);
    this.original = data;
    console.log("edit assignedToID", data.assignedToID)
    this.classService.getStudentsDataByID(data.assignedToID).then(studentsData => {
      this.students = studentsData;
    });

  //retrieve the data (class id, createdBy, assignedTo <= users)
    this.goal = new GoalClass(data.description, this.editDate, data.classID, data.hasCompleted, data.pending, data.declined,
      data.id, data.createdBy, data.assignedToID);
    this.prevGoal = this.goal;

   }

  ngOnInit() {
    this.assignedToAll = this.students.length === this.goal.assignedToID.length;
  }

  formComplete():boolean{
    return this.goal.assignedToID.length > 0 && this.goal.description != '' && this.goal.dueDate != null;
  }

  editGoal(){
    this.goal.dueDate = this.editDate;
    if(this.goal.hasCompleted == null){
      this.goal.hasCompleted = [];
    }
    console.log("editing goal", this.goal);
    this.loading = true;
    this.goalService.editGoal(this.goal, this.prevGoal).then(() => {
      this.loading = false;
      this.dialogRef.close('success');
    })
  }

}
