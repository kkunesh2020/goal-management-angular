import { Component, Input, OnInit } from '@angular/core';
import { Class } from 'src/app/shared/models/class.model';
import { Goal } from 'src/app/shared/models/goal.model';
import { ClassService } from 'src/app/shared/services/class.service';
import { GoalStudentDataService } from 'src/app/shared/services/goal-student-data.service';
import { GoalService } from 'src/app/shared/services/goal.service';
import { StudentData } from '../../class/class.component';

@Component({
  selector: 'gms-goal-details',
  templateUrl: './goal-details.component.html',
  styleUrls: ['./goal-details.component.scss'],
})
export class GoalDetailsComponent implements OnInit {
  @Input() goal: Goal;
  studentData: any;
  displayedColumns = ['name', 'status'];
  statColumns = ['assigned', 'hasCompleted', 'pending', 'declined']
  stats: any[] = [];
  loading: boolean;
  students: any[] = [];

  constructor(private studentGoalService: GoalStudentDataService, private classService: ClassService) {}

  ngOnInit() {
    console.log('received goal', this.goal);

    if(this.goal){
      this.goal.assignedToID.forEach((studentEmail) => {
        this.studentGoalService.getStudentData(studentEmail).then((data) => {
          let status: string = this.studentGoalService.getStudentStatus(
            this.goal.hasCompleted,
            this.goal.pending,
            this.goal.declined,
            studentEmail
          );
          this.students.push({...data, status});
        })
      })
      console.log(this.students);
      this.stats.push({assigned: this.goal.assignedToID.length, hasCompleted: this.goal.hasCompleted.length, pending: this.goal.pending.length, declined: this.goal.declined.length});
    }
    

    this.studentGoalService.currentStudentGoal.subscribe((studentGoalData) => {
      if (studentGoalData == null) {
        this.studentData = null;
        return;
      }

      studentGoalData === 'loading;'
        ? (this.loading = true)
        : (this.loading = false);

      // if the student goal is retreived and valid run the below code
      if (
        Object.keys(studentGoalData).length > 0 &&
        studentGoalData !== 'loading'
      ) {
        this.studentData = studentGoalData;

        if (this.studentData.links == null) {
          this.studentData.links = [];
        }

        if (this.studentData.files == null) {
          this.studentData.files = [];
        }

        if(this.studentData.commits == null) {
          this.studentData.commits = [];
        }

        if(this.goal.hasCompleted.includes(this.studentData.email)) {
          this.studentData.status = 'completed';
        }

        if (this.goal.declined.includes(this.studentData.email)) {
          this.studentData.status = 'declined';
        }

        if (this.goal.pending.includes(this.studentData.email)) {
          this.studentData.status = 'pending';
        }

        this.studentData.status = this.studentData.status;
      }
    });
  }

  // opens up link in another tab
  goToLink(urlToOpen: string) {
    let url = '';
    if (!/^http[s]?:\/\//.test(urlToOpen)) {
      url += 'http://';
    }

    url += urlToOpen;
    window.open(url, '_blank');
  }
}
