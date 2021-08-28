import { Inject, Optional } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import DirectorClassClass from 'src/app/shared/models/directorClass';
import { DirectorClass } from 'src/app/shared/models/directorClass.model';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClassService } from 'src/app/shared/services/class.service';
import { GoalService } from 'src/app/shared/services/goal.service';
import { CreateGoalComponent } from '../create-goal/create-goal.component';
import { NbDialogRef, NbDialogService } from '@nebular/theme';


@Component({
  selector: 'gms-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.scss']
})
export class CreateClassComponent implements OnInit {

  class: DirectorClass;
  loading = false;
  teachers: User[] = [];
  teacherData: string = "";
  studentEmailInput: string;
  assignedStudentEmails: string[] = [];
  studentEmails: string[] = [];
  studentEmailError: string = "";
  selectedIcon: string = "science";
  assignedToAll: boolean;
  public data: any;
  icons = ['science', 'engineering', 'construction', 'psychology', 'school', 'history_edu', 'draw', 'functions', 'superscript', 'pie_chart_outline', 'computer', 'code', 'book_fill', 'biotech']

  constructor(private goalService: GoalService, private authService: AuthService, 
  @Optional() protected dialogRef: NbDialogRef<CreateClassComponent>, private classService: ClassService) {
    this.class = new DirectorClassClass('', '', [], '', 'book');
   }

  ngOnInit() {
  // initially assign to all students
    this.getTeacherData();
  }


  formComplete(): boolean {
    return this.class.title != "" && this.teacherData.length > 0 && this.class.title.length < 20;
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
    this.class.classIcon = this.selectedIcon;
    this.class.teacherEmail = this.teacherData;
    this.classService.createClassFromDirectorModel(this.class).then((id) => {
      // close dialog and update class list
      this.loading = false;
      this.dialogRef.close({result: 'success', data: {...this.class, id: id}});
    })
  }

}
