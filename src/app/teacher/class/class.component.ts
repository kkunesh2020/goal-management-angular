import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Class } from 'src/app/shared/models/class.model';
import { Goal } from 'src/app/shared/models/goal.model';
import { UpdateGoalComponent } from '../../dialogs/update-goal/update-goal.component';
import { EditGoalComponent } from '../../dialogs/edit-goal/edit-goal.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ClassService } from 'src/app/shared/services/class.service';
import { GoalService } from 'src/app/shared/services/goal.service';
import { BehaviorSubject } from 'rxjs';
import { CreateGoalComponent } from 'src/app/dialogs/create-goal/create-goal.component';
import UserClass from 'src/app/shared/models/user';
import { DocumentReference } from '@angular/fire/firestore';
import { User } from '../../shared/models/user.model';
import GoalClass from 'src/app/shared/models/goal';
import { DeleteGoalComponent } from 'src/app/dialogs/delete-goal/delete-goal.component';
import { ChangeStatusComponent } from 'src/app/dialogs/change-status/change-status.component';
import { CreateStudentGoalComponent } from 'src/app/dialogs/create-student-goal/create-student-goal.component';
import { GoalStudentDataService } from 'src/app/shared/services/goal-student-data.service';

export interface StudentData {
  name: string;
  id: string;
  goalsAssigned: number;
  goalsCompleted: number;
}

export interface GoalsTableData {
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  createdBy: string;
  goalReference: Goal,
  status: string
}


export interface GoalStat{
  description: string;
  dueDate: Date;
  assignedToID: Array<string>;
  hasCompleted: Array<string>;
  pending: Array<string>;
  declined: Array<string>;
  id: string;
}


const STUDENT_DATA: StudentData[] = [
];

const GOALS_DATA: GoalsTableData[] = [
];

const CLASS_GOALS_DATA: GoalStat[] = [
];

@Component({
  selector: 'gms-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  displayedColumns: string[] = ['name', 'goalsAssigned', 'goalsCompleted'];
  goalsDisplayedColumns: string[] = ['description', 'dueDate', 'isCompleted', 'createdBy'];
  classgoalsDisplayedColumns: string[] = ['description', 'dueDate', 'assignedTo', 'completed', 'edit'];
  goalsDataSource = GOALS_DATA;
  classGoals = CLASS_GOALS_DATA;
  class: Class;
  isAdmin: boolean;
  loading: boolean = true;
  uid: string;
  user: UserClass;
  classID: string;
  studentSource: StudentData[];
  studentDataSource = STUDENT_DATA;

  constructor(private route: ActivatedRoute, private classService: ClassService, private auth: AuthService,
              public dialog: MatDialog, private goalService: GoalService, private router: Router, private studentsGoalService: GoalStudentDataService) {
    this.auth.user$.subscribe(async (userProfile) => {
      this.loading = true;
      this.classID = this.route.snapshot.paramMap.get('classID');
      if(!userProfile) { return; }
      this.getClass(this.classID, userProfile.uid).then(() => {
        this.user = userProfile;
        this.isAdmin = userProfile.isAdmin;
        this.uid = userProfile.uid;
        if(!this.isAdmin){
          this.getGoalsForStudent(this.classID, userProfile.uid);
          this.loading = false;
        }else{
          this.getStudentData();
          this.getAllGoalsForTeacher(this.classID);
          this.loading = false;
        }
      });
    })
  }

  getStudentData(){ //work on this
    this.classService.getStudentsDataByReference(this.class.students).then(studentData => {
      console.log("retrieved student data", studentData);
      this.studentDataSource = studentData;
    });
  }

  openStudentData(studentID: string){
    this.router.navigate([`/classes/${this.classID}/students/${studentID}`]);
  }

  openGoalData(goalID: string){
    this.studentsGoalService.setStudentGoalData(null, null);
    this.router.navigate([`/classes/${this.classID}/goals/${goalID}`]);
  }

  goalIsCompleted(hasCompleted: string[], userID: string){
    console.log('goalIsCompleted?', this.goalService.userHasCompleted(hasCompleted, userID))
    return this.goalService.userHasCompleted(hasCompleted, userID);
  }

  getClass(id: string, teacherUID: string): Promise<any>{
    let promise = this.classService.getClass(teacherUID, id).then((data) => {
      this.class = data;
    });
    return promise;
  }

  getAllGoalsForTeacher(classID:string){
    this.loading = true;
    let goals: GoalStat[] = [];
    this.goalService.getGoalsForClass(classID).then((data) => {
      data.forEach(element => {
        let newGoal: GoalStat  = {
          description: element.description,
          dueDate: element.dueDate,
          pending: element.pending,
          declined: element.declined,
          hasCompleted: element.hasCompleted,
          assignedToID: element.assignedToID,
          id: element.id
        };
        goals.push(newGoal);
      });
      this.classGoals = goals;
      console.log('class goals', this.classGoals);
    });
    this.loading = false;
  }

  getLengthOf(array: any[]){
    if(array == null){
      return 0;
    }
    return array.length;
  }


  getGoalsForStudent(classID: string, studentID: string){
    this.loading = true;
    let goals: GoalsTableData[] = [];
    this.goalService.getGoalsForClassWithId(classID, studentID).then((data) => {
      data.forEach(element => {
        let status = this.goalService.getUserStatus(element.hasCompleted, element.pending, element.declined, studentID);
        console.log("goal status", status);
        let newGoal: GoalsTableData  = {
          description: element.description,
          dueDate: element.dueDate,
          isCompleted: this.goalIsCompleted(element.hasCompleted, studentID),
          createdBy: element.createdBy,
          goalReference: element,
          status: status
        }
        if(newGoal.status != 'declined'){
          goals.push(newGoal);
        }
  
      });
      this.goalsDataSource = goals;
      console.log(this.goalsDataSource);
    });
    this.loading = false;
  }

  openDialog(data: any, userID: string, isCompleted: boolean, status: string){
    data.uid = userID;
    console.log("opening data", data);
    data.isCompleted = isCompleted;
    let dialogRef;
    if(status == 'pending'){
      dialogRef = this.dialog.open(ChangeStatusComponent, {data, height: "20rem", width: "30rem"});
    }else{
      dialogRef = this.dialog.open(UpdateGoalComponent, {data, height: "30rem", width: "30rem"});
    }

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'updated' && !this.isAdmin){
        this.getGoalsForStudent(this.classID, this.uid);
      }
    });
  }

  createGoalDialog(){
    let data = {createdBy: this.user, classID: this.classID, students: this.classService.getStudentsData(this.class.students)};
    let dialogRef = this.dialog.open(CreateGoalComponent, {data, width: '27rem', height: '30rem', panelClass: 'custom-modalbox'});

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'success'){
        this.getAllGoalsForTeacher(this.classID);
      }
    });
  }

  createStudentGoalDialog(){
    let data = {createdBy: this.user, classID: this.classID, students: this.classService.getStudentsData(this.class.students)};
    let dialogRef = this.dialog.open(CreateStudentGoalComponent, {data, width: '27rem', height: '23rem'});

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'success'){
        this.getAllGoalsForTeacher(this.classID);
      }
    });
  }

  //class id, createdBy, assignedTo
  editDialog(goal: GoalStat) {
    console.log("completed students", goal.hasCompleted)
    let editData = new GoalClass(goal.description, goal.dueDate, this.classID, goal.hasCompleted, goal.pending, goal.declined, goal.id, this.user, goal.assignedToID);
    console.log("edit data", editData);
    const dialogRef = this.dialog.open(EditGoalComponent, {data: editData, height: "23rem", width: "30rem"});

    dialogRef.afterClosed().subscribe(result => {
    if (result === 'success' && this.isAdmin){
      this.getAllGoalsForTeacher(this.classID);
    }
  });
  }

  deleteDialog(goal: GoalStat){
    let deleteData = new GoalClass(goal.description, goal.dueDate, this.classID, goal.hasCompleted, goal.pending, goal.declined, goal.id, this.user, goal.assignedToID);
    const dialogRef = this.dialog.open(DeleteGoalComponent, {data: deleteData, height: "15rem", width: "20rem"});

    dialogRef.afterClosed().subscribe(result => {
    if (result === 'success' && this.isAdmin){
      this.getAllGoalsForTeacher(this.classID);
    }
  });
  }

  ngOnInit() {
  }

}
