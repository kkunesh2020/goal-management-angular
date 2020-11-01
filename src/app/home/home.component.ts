import { Component, OnInit } from '@angular/core';
import { HomeService } from '../shared/services/home.service';
import { Observable } from 'rxjs';
import { UpdateGoalComponent } from '../dialogs/update-goal/update-goal.component';
import {MatDialog} from '@angular/material/dialog';
import { AuthService } from '../shared/services/auth.service';
import { GoalService } from '../shared/services/goal.service';
import { DocumentReference } from '@angular/fire/firestore';
import GoalClass from '../shared/models/goal';

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
  goalsDisplayedColumns: string[] = ['description', 'dueDate', 'isCompleted', 'createdBy'];


  constructor(private homeService: HomeService, public dialog: MatDialog, public auth: AuthService, private goalService: GoalService) {
    this.auth.user$.subscribe(async (userProfile) => {
      userProfile == null ? this.loggedIn = false : this.loggedIn = true;
      this.loading = true;
      if (userProfile) {
        this.uid = userProfile.uid;
        this.isAdmin = userProfile.isAdmin;
      }
      this.loading = false;
    });
    this.loading = false;
   }

   goalIsCompleted(hasCompleted: string[], userID: string){
    return this.goalService.userHasCompleted(hasCompleted, userID);
  }

  ngOnInit() {

  }


}
