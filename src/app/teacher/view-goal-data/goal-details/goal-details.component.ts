import { Component, Input, OnInit } from '@angular/core';
import { Class } from 'src/app/shared/models/class.model';
import { Goal } from 'src/app/shared/models/goal.model';
import { GoalStudentDataService } from 'src/app/shared/services/goal-student-data.service';
import { GoalService } from 'src/app/shared/services/goal.service';

@Component({
  selector: 'gms-goal-details',
  templateUrl: './goal-details.component.html',
  styleUrls: ['./goal-details.component.scss']
})
export class GoalDetailsComponent implements OnInit {

  @Input() goal: Goal;
  studentData: any;

  constructor(private studentGoalService: GoalStudentDataService) { }

  ngOnInit() {
    console.log("received goal", this.goal);
    this.studentGoalService.currentStudentGoal.subscribe(studentGoalData => {
      if(Object.keys(studentGoalData).length > 0){
        this.studentData = studentGoalData;

        if(this.studentData.links == null){
          this.studentData.links = [];
        }

        if(this.studentData.files == null){
          this.studentData.files = [];
        }
      }

    });
  }



}
