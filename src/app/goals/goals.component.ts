import { Component, OnInit } from '@angular/core';
import { HomeService } from '../shared/services/home.service';
import { Observable, of } from 'rxjs';
import { browser } from 'protractor';

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
  goalsDisplayedColumns: string[] = [
    'description',
    'dueDate',
    'isCompleted',
    'createdBy'
  ];
  goalsDataSource: Array<GoalElement>;
  userNames = [];
  dataReceived = false;
  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.showGoals();
  }

  showGoals() {
    this.homeService.getUserGoals().subscribe(goals => {
      this.goalsDataSource = goals;
      this.createUserNameDictionary(this.goalsDataSource);
      console.log(this.userNames);
    });
  }

  createUserNameDictionary(goals: Array<GoalElement>): void {
    const createdByIDs = [];
    goals.map(goal => {
      createdByIDs.push(goal.createdBy);
    });
    this.homeService.getUserNames(createdByIDs).then(result => {
      // this.userNames = result;
      this.dataReceived = true;
    });
  }

  getUserName(userId: string): string {
    if (this.userNames.length) {
      const blah = this.userNames.find(element => element.userId === userId)
        .name;
      console.log(blah);
      return blah;
    }
    return '';
  }
}
