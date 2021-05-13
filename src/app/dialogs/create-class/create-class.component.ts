import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import DirectorClassClass from 'src/app/shared/models/directorClass';
import { DirectorClass } from 'src/app/shared/models/directorClass.model';
import { GoalService } from 'src/app/shared/services/goal.service';
import { CreateGoalComponent } from '../create-goal/create-goal.component';


@Component({
  selector: 'gms-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.scss']
})
export class CreateClassComponent implements OnInit {

  class: DirectorClass;
  loading = false;
  studentEmailInput: string;
  assignedStudentID: string[] = [];
  studentEmails: string[] = [];
  studentEmailError: string = "";
  selectedIcon: string = "science";
  assignedToAll: boolean;
  icons = ['science', 'engineering', 'construction', 'psychology', 'school', 'history_edu', 'draw', 'functions', 'superscript', 'pie_chart_outline', 'build', 'code', 'book_fill', 'biotech']

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private goalService: GoalService,
              public dialogRef: MatDialogRef<CreateGoalComponent>) {
    this.class = new DirectorClassClass(0, '', '', [], '');

   }

  ngOnInit() {
  // initially assign to all students
    this.assignAllStudents();
  }

  assignAllStudents() {
    // this.assignedStudentID = [];
    // this.data.students.forEach(student => {
    //   this.assignedStudentID.push(student.uid);
    // });
  }


  formComplete(): boolean {
    return this.class.title != "" && this.class.students.length > 0;
  }

  checkSpecific(studentID: string, assigned: boolean) {
    if (assigned) {
      this.assignedStudentID.push(studentID);
    } else { // removes from assigned student array
      this.assignedStudentID = this.assignedStudentID.filter(id => id !== studentID);
    }
  }


  resetList() {
    this.assignedToAll = false;
    console.log(this.assignedToAll);
    this.assignedStudentID = [];
  }

  enterStudent(){
    if(!this.validateEmail(this.studentEmailInput)){
      alert("error")
      this.studentEmailError = "Invalid email! Please try again.";
      return;
    }
    this.studentEmails.push(this.studentEmailInput);
    this.studentEmailInput = "";
    this.studentEmailError = "";
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  setSelectedIcon(icon: string){
    this.selectedIcon = icon;
  }


  createClass() {
    this.loading = true;
    // this.goalService.createGoal(this.goal).then(() => {
    //   this.loading = false;
    //   this.dialogRef.close('success');
    // });
  }

}
