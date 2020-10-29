import { Component, Input, OnInit } from '@angular/core';
import { Class } from 'src/app/shared/models/class.model';
import { Goal } from 'src/app/shared/models/goal.model';
import { GoalService } from 'src/app/shared/services/goal.service';

@Component({
  selector: 'gms-goal-details',
  templateUrl: './goal-details.component.html',
  styleUrls: ['./goal-details.component.scss']
})
export class GoalDetailsComponent implements OnInit {

  @Input() goalID: string;
  goal: Goal;
  constructor(private goalService: GoalService) { }

  ngOnInit() {
    this.getGoal();
  }

  getGoal(){
    this.goalService.getGoalById(this.goalID).then((goal) => {
      this.goal = goal;
    });
  }

}
