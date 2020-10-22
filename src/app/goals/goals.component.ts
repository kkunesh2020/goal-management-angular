import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UpdateGoalComponent } from '../dialogs/update-goal/update-goal.component';
import { AuthService } from '../shared/services/auth.service';
import { GoalService } from '../shared/services/goal.service';
import { GoalStat } from '../teacher/class/class.component';

const STUDENT_GOALS_DATA: GoalStat[] = [
];

@Component({
  selector: 'gms-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent implements OnInit {
  loading: boolean;
  uid: string;
  dataSource: MatTableDataSource<GoalStat>;
  goalsDisplayedColumns: string[] = ['description', 'dueDate', 'isCompleted', 'createdBy'];

  constructor(private auth: AuthService, private goalService: GoalService, public dialog: MatDialog,
    private router: Router) {
    this.loading = true;
    this.dataSource = new MatTableDataSource<GoalStat>();
    this.auth.user$.subscribe(async (userProfile) => {
      if(!userProfile) { return; }
      this.uid = userProfile.uid;
      if(userProfile.goalsAssigned.length > 0){
        this.getStudentGoals(userProfile.goalsAssigned);
      }
    })
    this.loading = false;
  }

  ngOnInit() {
  }

  getStudentGoals(goalArray: DocumentReference[]){
    let goals: GoalStat[] = [];
    goals = this.goalService.getGoalsById(goalArray);
    console.log("goals", goals);
    this.dataSource = new MatTableDataSource<GoalStat>(goals);
  }



  openDialog(data: any, userID: string, isCompleted: boolean){
    data.uid = userID;
    data.isCompleted = isCompleted;
    let dialogRef = this.dialog.open(UpdateGoalComponent, {data});

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'updated'){
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/goals']);
      });
      }
    });
  }

}
