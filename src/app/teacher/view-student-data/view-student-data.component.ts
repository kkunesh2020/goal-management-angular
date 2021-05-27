import { Component, OnInit } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import UserClass from 'src/app/shared/models/user';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClassService } from 'src/app/shared/services/class.service';
import { GoalService } from 'src/app/shared/services/goal.service';
import { GoalStat } from '../class/class.component';
import { GoalStudentDataService } from 'src/app/shared/services/goal-student-data.service';

@Component({
  selector: 'gms-view-student-data',
  templateUrl: './view-student-data.component.html',
  styleUrls: ['./view-student-data.component.scss'],
})
export class ViewStudentDataComponent implements OnInit {
  loading: boolean;
  classID: string;
  studentID: string;
  student: UserClass;
  studentGoals: GoalStat[] = [];
  completedGoals: GoalStat[] = [];
  missingGoals: GoalStat[] = [];

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private goalService: GoalService,
    private classService: ClassService,
    private router: Router,
    private studentsGoalService: GoalStudentDataService
  ) {
    this.loading = true;
    this.auth.user$.subscribe(async (userProfile) => {
      this.classID = this.route.snapshot.paramMap.get('classID');
      this.studentID = this.route.snapshot.paramMap.get('studentID');
      if (!userProfile) {
        return;
      }
      this.getStudentData();
      this.getStudentGoals().then(() => {
        this.sortGoals();
      });
    });
    this.loading = false;
  }

  ngOnInit() {}

  getStudentData() {
    this.classService.getStudentDataByID(this.studentID).then((studentData) => {
      this.student = studentData;
    });
  }

  // get goals for the student
  getStudentGoals(): Promise<any> {
    const goals: GoalStat[] = [];
    const promise = this.goalService
      .getGoalsForClassWithId(this.classID, this.studentID)
      .then((data) => {
        // loop through each goal
        data.forEach((element) => {
          const newGoal: GoalStat = {
            description: element.description,
            dueDate: element.dueDate,
            hasCompleted: element.hasCompleted,
            pending: element.pending,
            declined: element.declined,
            assignedToID: element.assignedToID,
            id: element.id,
            createdBy: element.createdBy
          };
          goals.push(newGoal);
        });
        this.studentGoals = goals;
        console.log('student class goals', this.studentGoals);
      });
    return promise;
  }

  navigateToGoal(goalID: string) {
    // view goal data
    this.studentsGoalService.setStudentGoalData(null, null);
    this.router.navigate([`/classes/${this.classID}/goals/${goalID}`]);
  }

  // check if a goal is completed
  isCompleted(goal: GoalStat): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.student.goalsCompleted.forEach((goalRef) => {
        if (goalRef.id === goal.id) {
          resolve(true); // true because it is inside completed array
        }
      });
      return resolve(false);
    });
  }

  sortGoals() {
    console.log('sorting goals');
    this.studentGoals.forEach((goal) => {
      console.log('testing', this.isCompleted(goal));
      this.isCompleted(goal).then((result) => {
        if (result) {
          console.log('is completed!');
          this.completedGoals.push(goal);
        } else {
          console.log('missing!');
          this.missingGoals.push(goal);
        }
      });
    });
    console.log('completed', this.missingGoals, this.completedGoals);
  }

  navigateBack() {
    this.router.navigate([`classes/${this.classID}`]);
  }
}
