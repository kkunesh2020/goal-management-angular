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
  goal : GoalClass;
  allAssigned: boolean = false;
  loading: boolean = false;


  //data needed: createdBy classID

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private goalService: GoalService,
              public dialogRef: MatDialogRef<CreateGoalComponent>) {
    this.goal = new GoalClass('', null, data.classID, [], '', data.createdBy, []);
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

  checkAssignedTo(studentUID: string){
    if(this.goal.assignedToID == []){
      return false;
    }
    return this.goal.assignedToID.includes(studentUID);
  }

  formComplete():boolean{
    return this.goal.assignedToID != [] && this.goal.description != '' && this.goal.dueDate != null;
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

  isAssigned(studentUID: string){
    return this.goal.assignedToID.includes(studentUID);
  }

  createGoal(){
    console.log("created goal");
    console.log(this.goal);
    this.loading = true;
    this.goalService.createGoal(this.goal).then(()=>{
      this.loading = false;
      this.dialogRef.close('success');
    });
  }

}
