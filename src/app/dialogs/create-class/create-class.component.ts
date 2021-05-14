import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import DirectorClassClass from 'src/app/shared/models/directorClass';
import { DirectorClass } from 'src/app/shared/models/directorClass.model';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClassService } from 'src/app/shared/services/class.service';
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
  teachers: User[] = [];
  studentEmailInput: string;
  assignedStudentID: string[] = [];
  studentEmails: string[] = [];
  studentEmailError: string = "";
  selectedIcon: string = "science";
  assignedToAll: boolean;
  icons = ['science', 'engineering', 'construction', 'psychology', 'school', 'history_edu', 'draw', 'functions', 'superscript', 'pie_chart_outline', 'computer', 'code', 'book_fill', 'biotech']

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private goalService: GoalService, 
              public dialogRef: MatDialogRef<CreateGoalComponent>, private classService: ClassService) {
    this.class = new DirectorClassClass(0, '', '', [], '', [], 'book');

   }

  ngOnInit() {
  // initially assign to all students
    this.getTeacherData();
  }


  formComplete(): boolean {
    return this.class.title != "" && this.studentEmails.length > 0;
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

  getTeacherData(){
    this.classService.getAllTeachers().then((teacher) => {
      this.teachers = teacher;
    })
  }


  enterStudent(){
    if(!this.validateEmail(this.studentEmailInput)){
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
    this.class.studentEmails = [];
    this.class.members = 0;
    this.class.classIcon = this.selectedIcon;
    this.classService.createClassFromDirectorModel(this.class).then(() => {
      // close dialog and update class list
      this.loading = false;
      this.dialogRef.close({result: 'success', data: this.class});
    })
  }

}
