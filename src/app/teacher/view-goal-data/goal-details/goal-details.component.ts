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
  loading: boolean;

  constructor(private studentGoalService: GoalStudentDataService) { }

  ngOnInit() {
    console.log("received goal", this.goal);
    this.studentGoalService.currentStudentGoal.subscribe(studentGoalData => {
      if(studentGoalData == null){
        this.studentData = null;
        return;
      }

      studentGoalData == "loading" ? this.loading = true : this.loading = false;

      if(Object.keys(studentGoalData).length > 0 && studentGoalData != "loading"){

        this.studentData = studentGoalData;

        if(this.studentData.links == null){
          this.studentData.links = [];
        }

        if(this.studentData.files == null){
          this.studentData.files = [];
        }

        if(this.goal.hasCompleted.includes(this.studentData.uid)){
          this.studentData.status = 'completed';
        }

        if(this.goal.declined.includes(this.studentData.uid)){
          this.studentData.status = 'declined';
        }

        if(this.goal.pending.includes(this.studentData.uid)){
          this.studentData.status = 'pending';
        }

        console.log(this.studentData.status);
      }

    });
  }

  goToLink(urlToOpen: string){
    let url: string = '';
    if (!/^http[s]?:\/\//.test(urlToOpen)) {
        url += 'http://';
    }

    url += urlToOpen;
    window.open(url, "_blank");
  }

}
