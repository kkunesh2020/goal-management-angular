import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import GoalClass from '../../shared/models/goal';

@Component({
  selector: 'gms-create-goal',
  templateUrl: './create-goal.component.html',
  styleUrls: ['./create-goal.component.scss']
})
export class CreateGoalComponent implements OnInit {
  goal : GoalClass;

  //data needed: createdBy classID

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    // description: string,
    // dueDate: Date,
    // classID: string,
    // hasCompleted: Array<String>,
    // id: string,
    // createdBy: User,
    // assignedToID: Array<String>,
    // assignedTo?: Array<User>,
    // notes?: string,
    // groups?: Array<Group>
    this.goal = new GoalClass('', null, data.classID, [], '', data.createdBy, [], [], '', []);
   }

  ngOnInit() {
  }

  createGoal(){
    console.log("created goal");
    console.log(this.goal);
  }

}
