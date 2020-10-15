import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Class } from 'src/app/shared/models/class.model';
import { Goal } from 'src/app/shared/models/goal.model';
import { UpdateGoalComponent } from '../../dialogs/update-goal/update-goal.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ClassService } from 'src/app/shared/services/class.service';
import { GoalService } from 'src/app/shared/services/goal.service';
import { BehaviorSubject } from 'rxjs';

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
  selector: 'gms-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  displayedColumns: string[] = ['name', 'goalsAssigned', 'goalsCompleted'];
  goalsDisplayedColumns: string[] = ['description', 'dueDate', 'isCompleted', 'createdBy'];
  goalsDataSource = GOALS_DATA;
  goalData: Goal[];
  class: Class;
  isAdmin: boolean;
  dataSource = ELEMENT_DATA;

  constructor(private route: ActivatedRoute, private classService: ClassService, private auth: AuthService, public dialog: MatDialog, private goalService: GoalService) {
    this.auth.user$.subscribe(async (userProfile) => {
      const id = this.route.snapshot.paramMap.get('classID');
      if(!userProfile) return;
      console.log("getting class for " + id);
      this.getClass(id, userProfile.uid);
      this.isAdmin = userProfile.isAdmin;
      if(!this.isAdmin){
        this.getGoals(id, userProfile.uid);
      }
    })

  }

  getClass(id: string, teacherUID: string){
    this.classService.getClass(teacherUID, id).then((data) => {
      this.class = data;
    });
  }


  getGoals(classID: string, studentID: string){
    let goals: GoalsData[] = [];
    this.goalService.getGoalsForClass(classID, studentID).then((data) => {
      data.forEach(element => {
        let newGoal: GoalsData  = {
          description: element.description,
          dueDate: element.dueDate,
          isCompleted: element.isCompleted,
          createdBy: element.createdBy,
        }
        goals.push(newGoal);
      });
      this.goalsDataSource = goals;
      console.log(this.goalsDataSource);
    })
  }

  openDialog(data: any){
    this.dialog.open(UpdateGoalComponent, {data});
  }

  ngOnInit() {
  }

}
