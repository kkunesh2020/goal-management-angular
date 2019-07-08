import { Component, OnInit } from '@angular/core';
import { HomeService } from '../shared/services/home.service';


export interface GoalElement {
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  createdBy: string;
  assignedTo: string;
}

const GOAL_DATA: GoalElement[] = [];

@Component({
  selector: 'gms-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})

export class GoalsComponent implements OnInit {
  dataSource = GOAL_DATA;
  goalsDisplayedColumns: string[] = ['description', 'dueDate', 'isCompleted', 'createdBy'];
  goalsDataSource: Array<GoalElement>;
  userNames = [];

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.showGoals();
  }

  showGoals() {
    this.homeService.getAddedGoals().subscribe(goals => {
      this.goalsDataSource = goals;
    });
  }

  createUserNameDictionary(goals: Array<GoalElement>): void {
    const createdByIDs = [];
    goals.map(goal => {
      createdByIDs.push(goal.createdBy);
    });
    this.homeService.getUserNames(createdByIDs).then(result => {
      this.userNames = result;
    });
  }

  getUserName(userId: string): string {
    if (this.userNames.length) {
      return this.userNames.find(element => element.userId === userId).name;
    }
    return '';
  }

  getAssignedTo(uid: string): string {
    if (this.goalsDataSource.length) {
      return
    }
  }

  getUserGoals(assignedTo: string): Array<GoalElement> {
    return this.goalsDataSource.filter(element => element.assignedTo === assignedTo);
  }


}
