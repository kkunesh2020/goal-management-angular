import { Component, OnInit } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import UserClass from 'src/app/shared/models/user';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClassService } from 'src/app/shared/services/class.service';
import { GoalService } from 'src/app/shared/services/goal.service';
import { GoalStat } from '../class/class.component';

@Component({
  selector: 'gms-view-student-data',
  templateUrl: './view-student-data.component.html',
  styleUrls: ['./view-student-data.component.scss']
})
export class ViewStudentDataComponent implements OnInit {

  loading: boolean;
  classID: string;
  studentID: string;
  student: UserClass;
  studentGoals: GoalStat[] = [];

  constructor(private route: ActivatedRoute, private auth: AuthService, private goalService: GoalService, private classService: ClassService) {
    this.loading = true;
    this.auth.user$.subscribe(async (userProfile) => {
      this.classID = this.route.snapshot.paramMap.get('classID');
      this.studentID = this.route.snapshot.paramMap.get('studentID');
      if(!userProfile) { return; }
      this.getStudentData();
      this.getStudentGoals();
    });
    this.loading = false;
  }

  ngOnInit() {
  }

  getStudentData(){
    this.classService.getStudentDataByID(this.studentID).then(studentData => {
      this.student = studentData;
    })
  }

  getStudentGoals(){
    let goals: GoalStat[] = [];
    this.goalService.getGoalsForClassWithId(this.classID, this.studentID).then((data) => {
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
      this.studentGoals = goals;
      console.log('class goals', this.studentGoals);
    });
  }

}
