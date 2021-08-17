import { ChangeDetectorRef, Component } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UpdateGoalComponent } from '../dialogs/update-goal/update-goal.component';
import { AuthService } from '../shared/services/auth.service';
import { GoalService } from '../shared/services/goal.service';
import GoalClass from '../shared/models/goal';
import { ChangeStatusComponent } from '../dialogs/change-status/change-status.component';
import { WarningPendingComponent } from '../dialogs/warning-pending/warning-pending.component';
import { Class } from '../shared/models/class.model';
import { ClassService } from '../shared/services/class.service';
import UserClass from '../shared/models/user';
import { CreateStudentGoalComponent } from '../dialogs/create-student-goal/create-student-goal.component';
import { NbDialogService, NbGetters, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  name: string;
  size: string;
  kind: string;
  items?: number;
}

@Component({
  selector: 'gms-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss'],
})
export class GoalsComponent {
  loading = true;
  uid: string;
  dataSource = new MatTableDataSource([]);
  source: NbTreeGridDataSource<FSEntry>;
  classes: Class[] = [];
  user:UserClass;
  customColumn = 'name';
  defaultColumns = [ 'size', 'kind', 'items' ];
  allColumns = [ this.customColumn, ...this.defaultColumns ];

  goalsDisplayedColumns: string[] = [
    'description',
    'dueDate',
    'isCompleted',
    'createdBy',
  ];

  data: TreeNode<FSEntry>[] = [
    {
      data: { name: 'Projects', size: '1.8 MB', items: 5, kind: 'dir' },
    },
    {
      data: { name: 'Reports', kind: 'dir', size: '400 KB', items: 2 },
    },
    {
      data: { name: 'Other', kind: 'dir', size: '109 MB', items: 2 },
    },
  ];

  constructor(
    private auth: AuthService,
    private goalService: GoalService,
    public dialog: MatDialog,
    private router: Router,
    private classService: ClassService,
    private dialogService: NbDialogService,
     dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>
  ) {
    this.loading = true;
    // get userProfile data for user
    this.auth.user$.subscribe(async (userProfile) => {
      if (userProfile == null) {
        return;
      }
      this.user = userProfile;
      this.uid = userProfile.email;
      this.classes = await this.classService.getClasses(userProfile.email);
      console.log("classes", this.classes)
      if (userProfile.goalsAssigned.length > 0) {
        this.getStudentGoals(userProfile.goalsAssigned);
      } else {
        this.loading = false;
      }
    });

    this.source = dataSourceBuilder.create(this.data);
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

  async createGoalDialog(classData: Class){
    const data = {
      createdBy: this.user,
      classID: classData.id,
      students: this.classService.getStudentsDataByReference(classData.students),
    };

    let goalData = new GoalClass(
      '',
      '',
      null,
      data.classID,
      [],
      [data.createdBy.email],
      [],
      '',
      data.createdBy,
      [data.createdBy.email]
    );

    this.dialogService.open(CreateStudentGoalComponent, {context: {goal: goalData}})
      .onClose.subscribe(result => {
        if(result == "success"){
          this.getStudentGoals(this.user.goalsAssigned);
        }
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
