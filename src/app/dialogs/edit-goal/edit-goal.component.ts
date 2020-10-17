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
  loading: boolean = false;
  allAssigned: boolean = false;
  students: any[];

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any, private goalService: GoalService,
  public dialogRef: MatDialogRef<EditGoalComponent>, private classService: ClassService) {

    this.students = this.classService.getStudentsDataByID(data.assignedToStudents);

  //retrieve the data (class id, createdBy, assignedTo <= users)
    this.goal = new GoalClass(data.description, data.dueDate, data.classID, data.completedStudents,
      data.id, data.createdBy, data.assignedToStudents);

    console.log("studesnt::: ", data.assignedToStudents);
   }

  ngOnInit() {
  }

  assignToAll(assign: boolean) {
    this.allAssigned = assign;
    this.data.students.forEach(student => {
      if(assign){
        this.goal.assignedToID.push(student.uid);
      }else{
        this.goal.assignedToID = [];
      }

    })
  }

  checkSpecific(student: any, assigned: boolean){
    if(assigned){
      this.goal.assignedToID.push(student.uid);
    }else{ //removes student entrys from assigned to arrays
      this.allAssigned = false;
      console.log("student uid", student.uid);
      this.goal.assignedToID = this.goal.assignedToID.filter(uid => uid != student.uid);
    }
  }

  checkAssignedTo(studentUID: string){
    if(this.goal.assignedToID == []){
      return false;
    }
    return this.goal.assignedToID.includes(studentUID);
  }

  formComplete():boolean{
    return this.goal.assignedToID != [] && this.goal.description != '' && this.goal.dueDate != null;
  }

  isAssigned(studentUID: string){
    return this.goal.assignedToID.includes(studentUID);
  }

  deleteGoal(){
    this.loading = true;
    this.goalService.deleteGoal(this.data).then(() => {
      this.loading = false;
      this.dialogRef.close('success');
    })
  }

  editGoal(){
    this.loading = true;
    this.goalService.editGoal(this.data).then(() => {
      this.loading = false;
      this.dialogRef.close('success');
    })
  }
}
