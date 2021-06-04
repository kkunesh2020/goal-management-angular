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
import { ChangeStatusComponent } from '../dialogs/change-status/change-status.component';
import { WarningPendingComponent } from '../dialogs/warning-pending/warning-pending.component';

@Component({
  selector: 'gms-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss'],
})
export class GoalsComponent {
  loading = true;
  uid: string;
  dataSource = new MatTableDataSource([]);

  goalsDisplayedColumns: string[] = [
    'description',
    'dueDate',
    'isCompleted',
    'createdBy',
  ];

  constructor(
    private auth: AuthService,
    private goalService: GoalService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.loading = true;
    // get userProfile data for user
    this.auth.user$.subscribe(async (userProfile) => {
      if (userProfile == null) {
        return;
      }
      this.uid = userProfile.email;
      if (userProfile.goalsAssigned.length > 0) {
        this.getStudentGoals(userProfile.goalsAssigned);
      } else {
        this.loading = false;
      }
    });
  }

  // get goals for student given a goal array containing goal document refs
  getStudentGoals(goalArray: DocumentReference[]) {
    this.loading = true;
    this.goalService.getGoalsById(goalArray, this.uid).then((goalData) => {
      console.log('goals', goalData);
      // spread out each goal object into dataSource using spread operator
      this.dataSource.data = [...goalData];
      this.loading = false;
    });
  }

  openDialog(data: any, userID: string, isCompleted: boolean, status: string) {
    data.email = userID;
    data.isCompleted = isCompleted;
    let dialogRef;
    // if goal status is pending open Change Status dialog otherwise open Update Goal dialog
    if (status === 'pending' && data.createdBy.accountType == "teacher") {
      dialogRef = this.dialog.open(ChangeStatusComponent, {
        data,
        width: '30rem',
      });
    }else if(status === 'pending' && data.createdBy.accountType == "student"){
      dialogRef = this.dialog.open(WarningPendingComponent, {
        height: '15rem',
        width: '30rem',
      });
    }
    else {
      dialogRef = this.dialog.open(UpdateGoalComponent, {
        data,
        width: '30rem',
      });
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'updated') {
        // if goal is successfully updated reload data on page
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['/goals']);
          });
      }

      if(result && result.data && result.status == "updated"){
        let goalRef = new GoalClass(
          result.data.description,
          result.data.dueDate,
          result.data.classID,
          result.data.hasCompleted,
          result.data.pending,
          result.data.declined,
          result.data.id,
          result.data.createdBy,
          result.data.assignedToID,
          result.data.declinedMessages,
          result.data.files,
          result.data.links,
          result.data.commits
        );
        const status = this.goalService.getUserStatus(
          goalRef.hasCompleted,
          goalRef.pending,
          goalRef.declined,
          result.data.email
        );

        let newItem = {
          description: result.data.description,
          dueDate: result.data.dueDate,
          isCompleted: this.goalService.userHasCompleted(goalRef.hasCompleted, result.data.email),
          createdBy: result.data.createdBy.name,
          goalReference: goalRef,
          status
        };
        let newData = this.dataSource.data;
        newData = newData.filter(classData => classData.goalReference.id != result.data.id);
        newData.push(newItem);
        this.dataSource.data = newData;
      }
    });
  }
}
