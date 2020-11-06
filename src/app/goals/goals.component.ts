import { ChangeDetectorRef, Component } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UpdateGoalComponent } from '../dialogs/update-goal/update-goal.component';
import { Goal } from '../shared/models/goal.model';
import { AuthService } from '../shared/services/auth.service';
import { GoalService } from '../shared/services/goal.service';
import { GoalsTableData, GoalStat } from '../teacher/class/class.component';
import GoalClass from '../shared/models/goal';

@Component({
  selector: 'gms-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})


export class GoalsComponent {
  loading: boolean = true;
  uid: string;
  // goals: any[];
  dataSource = new MatTableDataSource([]);
  
  
  goalsDisplayedColumns: string[] = ['description', 'dueDate', 'isCompleted', 'createdBy'];

  constructor(private auth: AuthService, private goalService: GoalService, public dialog: MatDialog,
    private router: Router) {
    this.loading = true;
    this.auth.user$.subscribe(async (userProfile) => {
      if(userProfile == null) { return; }
      this.uid = userProfile.uid;
      if(userProfile.goalsAssigned.length > 0){
        this.getStudentGoals(userProfile.goalsAssigned);
      }
    })
  }


  getStudentGoals(goalArray: DocumentReference[]){
    this.goalService.getGoalsById(goalArray, this.uid).then(goalData => {
        console.log("goals", goalData);
        // this.goals = goalData;
        this.dataSource.data = [...goalData];
    });
    this.loading = false;
  }
  openDialog(data: any, userID: string, isCompleted: boolean){
    data.uid = userID;
    data.isCompleted = isCompleted;
    let dialogRef = this.dialog.open(UpdateGoalComponent, {data, width: "30rem", height: "30rem"});

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'updated'){
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/goals']);
      });
      }
    });
  }

}
