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

export interface GoalsTableData {
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  createdBy: string;
  goalReference: Goal
}

export interface GoalStat{
  description: string;
  dueDate: Date;
  assignedTo: number;
  completed: number;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Anastasia', goalsAssigned: 5, goalsCompleted: 5},
  {name: 'Bob', goalsAssigned: 3, goalsCompleted: 2},
  {name: 'Cheryl', goalsAssigned: 16, goalsCompleted: 0},
];

const GOALS_DATA: GoalsTableData[] = [
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
  uid: string;
  classID: string;
  dataSource = ELEMENT_DATA;

  constructor(private route: ActivatedRoute, private classService: ClassService, private auth: AuthService,
              public dialog: MatDialog, private goalService: GoalService) {
    this.auth.user$.subscribe(async (userProfile) => {
      this.classID = this.route.snapshot.paramMap.get('classID');
      if(!userProfile) return;
      this.getClass(this.classID, userProfile.uid);
      this.isAdmin = userProfile.isAdmin;
      this.uid = userProfile.uid;
      if(!this.isAdmin){
        this.getGoalsForStudent(this.classID, userProfile.uid);
      }
    })

  }

  goalIsCompleted(hasCompleted: string[], userID: string){
    console.log("goalIsCompleted?", this.goalService.userHasCompleted(hasCompleted, userID))
    return this.goalService.userHasCompleted(hasCompleted, userID);
  }

  getClass(id: string, teacherUID: string){
    this.classService.getClass(teacherUID, id).then((data) => {
      this.class = data;
    });
  }

  getAllGoalsForTeacher(classID:string){
    let goals: GoalStat[] = [];
    this.goalService.getGoalsForClass(classID).then((data) => {
      data.forEach(element => {
        let newGoal: GoalStat  = {
          description: element.description,
          dueDate: element.dueDate,
          assignedTo: element.assignedTo.length,
          completed: element.hasCompleted.length,
        }
        goals.push(newGoal);
      });
    })
  }


  getGoalsForStudent(classID: string, studentID: string){
    let goals: GoalsTableData[] = [];
    this.goalService.getGoalsForClassWithId(classID, studentID).then((data) => {
      data.forEach(element => {
        console.log("the element", element);
        let newGoal: GoalsTableData  = {
          description: element.description,
          dueDate: element.dueDate,
          isCompleted: this.goalIsCompleted(element.hasCompleted, studentID),
          createdBy: element.createdBy,
          goalReference: element
        }
        goals.push(newGoal);
      });
      this.goalsDataSource = goals;
      console.log(this.goalsDataSource);
    })
  }

  openDialog(data: any, userID: string, isCompleted: boolean){
    data.uid = userID;
    data.isCompleted = isCompleted;
    let dialogRef = this.dialog.open(UpdateGoalComponent, {data});

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'updated' && !this.isAdmin){
        this.getGoalsForStudent(this.classID, this.uid);
      }
    });
  }

  ngOnInit() {
  }

}
