import { Component, Input, OnInit } from '@angular/core';
import { Class } from 'src/app/shared/models/class.model';
import { Goal } from 'src/app/shared/models/goal.model';
import { ClassService } from 'src/app/shared/services/class.service';
import { GoalStudentDataService } from 'src/app/shared/services/goal-student-data.service';
import { StudentData } from '../../class/class.component';

@Component({
  selector: 'gms-student-bar',
  templateUrl: './student-bar.component.html',
  styleUrls: ['./student-bar.component.scss']
})
export class StudentBarComponent implements OnInit {

  @Input() class: Class;
  @Input() goal: Goal;
  @Input() teacherUID: string;
  students: StudentData[];
  highlightedStudent: string = 'all';

  constructor(private classService: ClassService, private studentDataService: GoalStudentDataService, private studentGoalService: GoalStudentDataService) {
   }

  ngOnInit() {
    console.log("teacherUID", this.teacherUID);
    this.getStudentData();
  }

  getStudentData(){ //work on this
    this.classService.getStudentsDataByReference(this.class.students).subscribe(studentData => {
      console.log("retrieved student data", studentData);
      this.students = studentData;
    });
  }

  viewStudentData(uid: string){
    this.studentDataService.setStudentGoalData(uid, this.goal);
    this.highlightedStudent = uid;
  }

  viewStudentsData(){
    this.highlightedStudent = 'all';
    this.studentDataService.setStudentGoalData(null, null);
  }


}
