import { Component, OnInit } from '@angular/core';
import { HomeService } from '../shared/services/home.service';
import { Observable } from 'rxjs';
import { UpdateGoalComponent } from '../dialogs/update-goal/update-goal.component';
import {MatDialog} from '@angular/material/dialog';
import { AuthService } from '../shared/services/auth.service';
import { GoalService } from '../shared/services/goal.service';
import { DocumentReference } from '@angular/fire/firestore';

export interface GoalsTableData {
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  createdBy: string;
}


@Component({
  selector: 'gms-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loggedIn: boolean = false;
  loading: boolean = true;
  isAdmin: boolean;
  uid: string;
  studentAssignments: GoalsTableData[];
  goalsAssigned: DocumentReference[]
  goalsDisplayedColumns: string[] = ['description', 'dueDate', 'isCompleted', 'createdBy'];


  constructor(private homeService: HomeService, public dialog: MatDialog, public auth: AuthService, private goalService: GoalService) {
    this.auth.user$.subscribe(async (userProfile) => {
      userProfile == null ? this.loggedIn = false : this.loggedIn = true;
      this.loading = false;
      this.uid = userProfile.uid;
      this.isAdmin = userProfile.isAdmin;
      if(!this.isAdmin){
        this.getStudentAssignments(userProfile.goalsAssigned);
        this.goalsAssigned = userProfile.goalsAssigned;
      }
    })
   }

   getStudentAssignments(goals: DocumentReference[]){
     let studentGoals: GoalsTableData[];
     goals.forEach(goal => {
      this.goalService.getGoalByReference(goal).then(data => {
        let goalData = {
          description: data.description,
          dueDate: data.dueDate,
          isCompleted: data.isCompleted,
          createdBy: data.createdBy
        };
        studentGoals.push(goalData);
      });
     });
     this.studentAssignments = studentGoals;
   }

   openDialog(data: any, userID: string, isCompleted: boolean){
    data.uid = userID;
    data.isCompleted = isCompleted;
    let dialogRef = this.dialog.open(UpdateGoalComponent, {data});

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'updated' && !this.isAdmin){
        this.getStudentAssignments(this.goalsAssigned);
      }
    });
  }

  ngOnInit() {

  }


}
