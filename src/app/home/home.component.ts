import { Component, OnInit } from '@angular/core';
import { HomeService } from '../shared/services/home.service';
import { Observable } from 'rxjs';
import { UpdateGoalComponent } from '../dialogs/update-goal/update-goal.component';
import {MatDialog} from '@angular/material/dialog';
import { AuthService } from '../shared/services/auth.service';


export interface GoalsData {
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  createdBy: string;
}


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

  goalsDisplayedColumns: string[] = ['description', 'dueDate', 'isCompleted', 'createdBy'];

  goalsDataSource = GOALS_DATA;

  constructor(private homeService: HomeService, public dialog: MatDialog, public auth: AuthService) { }

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


  openDialog(data: any){
    console.log("the data", data);
    this.dialog.open(UpdateGoalComponent, {data});
  }

}
