import { Component, OnInit, Input } from '@angular/core';
import { User } from '../shared/models/user.model';
import { Goal } from '../shared/models/goal.model';
import { GoalService } from '../shared/services/goal.service';

@Component({
  selector: 'gms-todays-goal',
  templateUrl: './todays-goal.component.html',
  styleUrls: ['./todays-goal.component.scss']
})
export class TodaysGoalComponent implements OnInit {

  @Input() currentStudent: User;
  goal: Goal;

  constructor(private goalService: GoalService) { }

  async ngOnInit() {
    await this.goalService
    .getTodaysGoal(this.currentStudent)
    .then(goal => {
      console.log('we go this');
      this.goal = goal;
      }
    );
  }

}
