import { Component, OnInit } from '@angular/core';
import { HomeService } from '../shared/services/home.service';
import { Observable } from 'rxjs';
import { User } from '../shared/models/user.model';
import { Goal } from '../shared/models/goal.model';

export interface PeriodicElement {
  name: string;
  goalsAssigned: number;
  goalsCompleted: number;
  view: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Anastasia', goalsAssigned: 5, goalsCompleted: 5, view: 'view'},
  {name: 'Bob', goalsAssigned: 3, goalsCompleted: 2, view: 'view'},
  {name: 'Cheryl', goalsAssigned: 16, goalsCompleted: 0, view: 'view'},
];

@Component({
  selector: 'gms-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['name', 'goalsAssigned', 'goalsCompleted', 'view'];
  dataSource = ELEMENT_DATA;
  userNames = [];
  // userNames = [
  //   {userId: 'mR9T1tHEwVcQbbUScFGY4TFqz0j2', name: 'J.D. DeVaughn-Brown'},
  //   {userId: 'SFyyskdkeERiwVJmHx0Bi2HNxg62', name: 'Jacob Dulai'},
  //   {userId: 'iyv2OTl7APb3gDqJKJuvFLPXozB3', name: 'Katie Kunesh'}
  // ]

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    // this.showGoals();
  }

  showGoals() {
    this.homeService.getAddedGoals().subscribe( goals => {
      this.goalsDataSource = goals;
    });
    console.log(this.goalsDataSource);
  }
}
