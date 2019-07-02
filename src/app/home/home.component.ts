import { Component, OnInit } from '@angular/core';
import { HomeService } from '../shared/services/home.service';
import { Observable } from 'rxjs';

export interface PeriodicElement {
  name: string;
  goalsAssigned: number;
  goalsCompleted: number;
}

export interface GoalsData {
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  createdBy: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Anastasia', goalsAssigned: 5, goalsCompleted: 5},
  {name: 'Bob', goalsAssigned: 3, goalsCompleted: 2},
  {name: 'Cheryl', goalsAssigned: 16, goalsCompleted: 0},
];

const GOALS_DATA: GoalsData[] = [
  {description: 'make table', dueDate: new Date('2019-07-03'), isCompleted: false, createdBy: 'JD'},
  {description: 'eat chipotle', dueDate: new Date('2019-07-03'), isCompleted: true, createdBy: 'JD'},
];

@Component({
  selector: 'gms-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['name', 'goalsAssigned', 'goalsCompleted'];
  goalsDisplayedColumns: string[] = ['description', 'dueDate', 'isCompleted', 'createdBy'];
  dataSource = ELEMENT_DATA;
  goalsDataSource = GOALS_DATA;

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.showGoals();
  }

  showGoals() {
    this.homeService.getAddedGoals().subscribe( goals => {
      this.goalsDataSource = goals;
    });
  }

  getUser(userId: string): Observable<any> {
    return this.homeService.getUser(userId);
  }

}
