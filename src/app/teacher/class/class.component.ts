import { Component } from '@angular/core';
import { MatDialog, MatPaginator } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Class } from 'src/app/shared/models/class.model';
import { Goal } from 'src/app/shared/models/goal.model';
import { UpdateGoalComponent } from '../../dialogs/update-goal/update-goal.component';
import { EditGoalComponent } from '../../dialogs/edit-goal/edit-goal.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClassService } from 'src/app/shared/services/class.service';
import { GoalService } from 'src/app/shared/services/goal.service';
import { CreateGoalComponent } from 'src/app/dialogs/create-goal/create-goal.component';
import UserClass from 'src/app/shared/models/user';
import GoalClass from 'src/app/shared/models/goal';
import { DeleteGoalComponent } from 'src/app/dialogs/delete-goal/delete-goal.component';
import { ChangeStatusComponent } from 'src/app/dialogs/change-status/change-status.component';
import { CreateStudentGoalComponent } from 'src/app/dialogs/create-student-goal/create-student-goal.component';
import { GoalStudentDataService } from 'src/app/shared/services/goal-student-data.service';
import { DocumentReference } from '@angular/fire/firestore';
import { WarningPendingComponent } from 'src/app/dialogs/warning-pending/warning-pending.component';

export interface StudentData {
  name: string;
  id: string;
  goalsAssigned: number;
  goalsCompleted: number
}

export interface GoalsTableData {
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  createdBy: string;
  goalReference: Goal;
  status: string;
}

export interface GoalStat {
  description: string;
  dueDate: Date;
  assignedToID: Array<string>;
  hasCompleted: Array<string>;
  pending: Array<string>;
  declined: Array<string>;
  id: string;
  createdBy: any;
}

@Component({
  selector: 'gms-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
})
export class ClassComponent {
  displayedColumns: string[] = ['name', 'goalsAssigned', 'goalsCompleted'];
  goalsDisplayedColumns: string[] = [
    'description',
    'dueDate',
    'isCompleted',
    'createdBy',
  ];
  classgoalsDisplayedColumns: string[] = [
    'description',
    'dueDate',
    'assignedTo',
    'completed',
    'edit',
  ];
  goalsDataSource: GoalsTableData[] = [];
  classGoals: GoalStat[] = [];
  class: Class;
  accountType: string;
  loading = true;
  uid: string;
  user: UserClass;
  classID: string;
  studentSource: StudentData[];
  studentDataSource: StudentData[] = [];

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private auth: AuthService,
    public dialog: MatDialog,
    private goalService: GoalService,
    private router: Router,
    private studentsGoalService: GoalStudentDataService
  ) {
    this.auth.user$.subscribe(async (userProfile) => {
      this.loading = true;
      this.classID = this.route.snapshot.paramMap.get('classID');
      if (!userProfile) {
        return;
      }
      this.getClass(this.classID, userProfile.uid).then(() => {
        this.user = userProfile;
        this.accountType = userProfile.accountType;
        this.uid = userProfile.uid;
        if (this.accountType === 'student') {
          this.getGoalsForStudent(this.classID, userProfile.uid);
          this.loading = false;
        } else if (this.accountType === 'teacher') {
          this.getStudentData();
          this.getAllGoalsForTeacher(this.classID);
          this.loading = false;
        }
      });
    });
  }

  getStudentData() {
    // work on this
    this.classService
      .getStudentsDataByReferenceClassID(this.class.students, this.classID)
      .then((studentData) => {
        console.log('retrieved student data', studentData);
        this.studentDataSource = studentData;
      });
  }

  openStudentData(studentID: string) {
    this.router.navigate([`/classes/${this.classID}/students/${studentID}`]);
  }

  openGoalData(goal: GoalStat) {
    //pending check
    console.log("pending", goal);
    console.log(this.getLengthOf(goal.pending), this.getLengthOf(goal.assignedToID), this.studentCreatedClass(goal));

    if(this.getLengthOf(goal.pending) == 1 && this.getLengthOf(goal.assignedToID) == 1 && this.studentCreatedClass(goal)){
      let dialogRef = this.dialog.open(ChangeStatusComponent, {
        data: {...goal, uid: goal.assignedToID[0]},
        height: '20rem',
        width: '30rem',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'updated') {
          // if the goal is successfully deleted, reshow goals
          this.getAllGoalsForTeacher(this.classID);
        }
      });
    }else{
      this.studentsGoalService.setStudentGoalData(null, null);
      this.router.navigate([`/classes/${this.classID}/goals/${goal.id}`]);
    }
  }

  async getAssignmentCount(studentAssignments: DocumentReference[]): Promise<number>{
    let count = 0;
    
    return count;
  }

  goalIsCompleted(hasCompleted: string[], userID: string) {
    console.log(
      'goalIsCompleted?',
      this.goalService.userHasCompleted(hasCompleted, userID)
    );
    return this.goalService.userHasCompleted(hasCompleted, userID);
  }

  getClass(id: string, teacherUID: string): Promise<any> {
    const promise = this.classService.getClass(teacherUID, id).then((data) => {
      this.class = data;
    });
    return promise;
  }

  getAllGoalsForTeacher(classID: string) {
    this.loading = true;
    const goals: GoalStat[] = [];
    this.goalService.getGoalsForClass(classID).then((data) => {
      data.forEach((element) => {
        const newGoal: GoalStat = {
          description: element.description,
          dueDate: element.dueDate,
          pending: element.pending,
          declined: element.declined,
          hasCompleted: element.hasCompleted,
          assignedToID: element.assignedToID,
          createdBy: element.createdBy,
          id: element.id,
        };
        goals.push(newGoal);
      });
      this.classGoals = goals;
      console.log('class goals', this.classGoals);
    });
    this.loading = false;
  }

  getLengthOf(array: any[]) {
    if (array == null) {
      return 0;
    }
    return array.length;
  }

  studentCreatedClass(goal: GoalStat): boolean{
    if(this.getLengthOf(goal.assignedToID) == 1 && (goal.createdBy.uid == goal.assignedToID[0])){
      return true;
    }
    return false;
  }

  getGoalsForStudent(classID: string, studentID: string) {
    this.loading = true;
    const goals: GoalsTableData[] = [];
    // get goals for class and loop through each
    this.goalService.getGoalsForClassWithId(classID, studentID).then((data) => {
      data.forEach((element) => {
        const status = this.goalService.getUserStatus(
          element.hasCompleted,
          element.pending,
          element.declined,
          studentID
        );
        const newGoal: GoalsTableData = {
          // intializes goal object to display on table
          description: element.description,
          dueDate: element.dueDate,
          isCompleted: this.goalIsCompleted(element.hasCompleted, studentID),
          createdBy: element.createdBy,
          goalReference: element,
          status,
        };
        if (newGoal.status !== 'declined') {
          // doesn't show declined goals
          goals.push(newGoal);
        }
      });
      this.goalsDataSource = goals;
    });
    this.loading = false;
  }

  openDialog(data: any, userID: string, isCompleted: boolean, status: string) {
    data.uid = userID;
    data.isCompleted = isCompleted;
    let dialogRef;

    if(status == "pending" && this.studentCreatedClass(data)){
      console.log("open pending");
     dialogRef = this.dialog.open(WarningPendingComponent, {
       height: '15rem',
       width: '30rem',
     });
   } else if (status === 'pending') {
      // if the goal status is pending display the change status dialog
      dialogRef = this.dialog.open(ChangeStatusComponent, {
        data,
        height: '20rem',
        width: '30rem',
      });
    } else {
      // otherwise display the update goal component
      dialogRef = this.dialog.open(UpdateGoalComponent, {
        data,
        height: '33rem',
        width: '30rem',
      });
    }

    dialogRef.afterClosed().subscribe((result) => {
      // reshow goals when dialog is closed
      if (result === 'updated' && this.accountType === 'student') {
        this.getGoalsForStudent(this.classID, this.uid);
      }

      if(result && result.status == 'deleted'){
        let newGoals = this.goalsDataSource.filter(goal => goal != result.id);
        this.goalsDataSource = newGoals;
      }
    });
  }

  async createGoalDialog() {
    // opens up the create goal dialog to create a new goal
    const data = {
      createdBy: this.user,
      classID: this.classID,
      students: [],
    };
    data.students = await this.classService.getStudentsDataByReference(this.class.students)
    // passes in class data into the dialog
    const dialogRef = this.dialog.open(CreateGoalComponent, {
      data,
      width: '27rem',
      height: '30rem',
      panelClass: 'custom-modalbox',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        // if a goal is created reshow goals
        this.getAllGoalsForTeacher(this.classID);
      }
    });
  }

  createStudentGoalDialog() {
    const data = {
      createdBy: this.user,
      classID: this.classID,
      students: this.classService.getStudentsDataByReference(this.class.students),
    };
    const dialogRef = this.dialog.open(CreateStudentGoalComponent, {
      data,
      width: '27rem',
      height: '23rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.getAllGoalsForTeacher(this.classID);
      }
    });
  }

  // shows dialog for editing a goal
  editDialog(goal: GoalStat) {
    const editData = new GoalClass(
      goal.description,
      goal.dueDate,
      this.classID,
      goal.hasCompleted,
      goal.pending,
      goal.declined,
      goal.id,
      this.user,
      goal.assignedToID
    );
    console.log('edit data', editData);
    // inputs class data into dialog
    const dialogRef = this.dialog.open(EditGoalComponent, {
      data: editData,
      height: '23rem',
      width: '30rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success' && this.accountType === 'teacher') {
        // if the goal is successfully edited, reshow goals
        this.getAllGoalsForTeacher(this.classID);
      }
    });
  }

  // opens up dialog to delete a goal
  deleteDialog(goal: GoalStat) {
    const deleteData = new GoalClass(
      goal.description,
      goal.dueDate,
      this.classID,
      goal.hasCompleted,
      goal.pending,
      goal.declined,
      goal.id,
      this.user,
      goal.assignedToID
    );
    const dialogRef = this.dialog.open(DeleteGoalComponent, {
      data: deleteData,
      height: '15rem',
      width: '20rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success' && this.accountType === 'teacher') {
        // if the goal is successfully deleted, reshow goals
        this.getAllGoalsForTeacher(this.classID);
      }
    });
  }
}
