import { Component, Input, OnInit } from '@angular/core';
import { Class } from 'src/app/shared/models/class.model';
import { ClassService } from 'src/app/shared/services/class.service';
import { StudentData } from '../../class/class.component';

@Component({
  selector: 'gms-student-bar',
  templateUrl: './student-bar.component.html',
  styleUrls: ['./student-bar.component.scss']
})
export class StudentBarComponent implements OnInit {

  @Input() class: Class;
  @Input() teacherUID: string;
  students: StudentData[];

  constructor(private classService: ClassService) {
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


}
