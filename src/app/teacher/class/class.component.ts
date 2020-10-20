import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
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

export interface StudentData {
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
  assignedToID: Array<string>;
  hasCompleted: Array<string>;
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
  classgoalsDisplayedColumns: string[] = ['description', 'dueDate', 'assignedTo', 'completed'];
  goalsDataSource = GOALS_DATA;
  classGoals = CLASS_GOALS_DATA;
  class: Class;
  isAdmin: boolean;
  loading: boolean;
  uid: string;
  user: UserClass;
  classID: string;
  studentSource: StudentData[];
  studentDataSource = STUDENT_DATA;

  constructor(private route: ActivatedRoute, private classService: ClassService, private auth: AuthService,
              public dialog: MatDialog, private goalService: GoalService) {
    this.loading = true;
    this.auth.user$.subscribe(async (userProfile) => {
      this.classID = this.route.snapshot.paramMap.get('classID');
      if(!userProfile) { return; }
      this.getClass(this.classID, userProfile.uid).then(() => {
        this.user = userProfile;
        this.isAdmin = userProfile.isAdmin;
        this.uid = userProfile.uid;
        if(!this.isAdmin){
          this.getGoalsForStudent(this.classID, userProfile.uid);
        }else{
          this.updateStudentTable();
          this.getAllGoalsForTeacher(this.classID);
        }
      });
    })
    this.loading = false;
  }


  updateStudentTable(){
    this.getStudentData();
    this.studentDataSource = this.studentSource;
  }

  getStudentData(){ //work on this
    let studentData: StudentData[] = [{name: "Bob", goalsAssigned: 0, goalsCompleted: 0}];
    this.class.students.forEach(ref => {
      this.classService.getStudentData(ref).then((student) => {
        let data: StudentData  = {name: student.name, goalsAssigned: this.getLengthOf(student.goalsAssigned),
          goalsCompleted: this.getLengthOf(student.goalsCompleted)};
        studentData.push(data);
      });
    });


    this.studentSource = studentData;
    console.log("studentDataSource", this.studentSource);

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
    let goals: GoalStat[] = [];
    this.goalService.getGoalsForClass(classID).then((data) => {
      data.forEach(element => {
        let newGoal: GoalStat  = {
          description: element.description,
          dueDate: element.dueDate,
          hasCompleted: element.hasCompleted,
          assignedToID: element.assignedToID,
          id: element.id
        };
        goals.push(newGoal);
      });
      this.classGoals = goals;
      console.log('class goals', this.classGoals);
    })
  }

  getLengthOf(array: any[]){
    if(array == null){
      return 0;
    }
    return array.length;
  }


  getGoalsForStudent(classID: string, studentID: string){
    let goals: GoalsTableData[] = [];
    this.goalService.getGoalsForClassWithId(classID, studentID).then((data) => {
      data.forEach(element => {
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

  createGoalDialog(){
    let data = {createdBy: this.user, classID: this.classID, students: this.classService.getStudentsData(this.class.students)};
    let dialogRef = this.dialog.open(CreateGoalComponent, {data});

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'success' && this.isAdmin){
        this.getAllGoalsForTeacher(this.classID);
      }
    });
  }

  //class id, createdBy, assignedTo
  editDialog(goal: GoalStat) {
    console.log("completed students", goal.hasCompleted)
    let editData = new GoalClass(goal.description, goal.dueDate, this.classID, goal.hasCompleted, goal.id, this.user, goal.assignedToID);
    console.log("edit data", editData);
    const dialogRef = this.dialog.open(EditGoalComponent, {data: editData});

    dialogRef.afterClosed().subscribe(result => {
    if (result === 'success' && this.isAdmin){
      this.getAllGoalsForTeacher(this.classID);
    }
  })
  }

  ngOnInit() {
  }

}
