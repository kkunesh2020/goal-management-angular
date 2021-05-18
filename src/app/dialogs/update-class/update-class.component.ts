import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClassService } from 'src/app/shared/services/class.service';

@Component({
  selector: 'gms-update-class',
  templateUrl: './update-class.component.html',
  styleUrls: ['./update-class.component.scss']
})
export class UpdateClassComponent implements OnInit {
  class: any;
  errorMessage: string = "";
  loading: boolean = false;
  selectedIcon: string = "";
  assignedStudentID: string[] = [];
  assignedToAll: boolean;
  icons = ['science', 'engineering', 'construction', 'psychology', 'school', 'history_edu', 'draw', 'functions', 'superscript', 'pie_chart_outline', 'computer', 'code', 'book_fill', 'biotech'];
  teachers = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private classService: ClassService) { }

  ngOnInit() {
    console.log("opened", this.data);
    this.class = this.data;
    //this.getTeacherData();
  }

  
  
    formComplete(): boolean {
      return this.class.title != "";
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
  
  
    // enterStudent(){
    //   if(!this.validateEmail(this.studentEmailInput)){
    //     this.studentEmailError = "Invalid email! Please try again.";
    //     return;
    //   }
    //   this.studentEmails.push(this.studentEmailInput);
    //   this.studentEmailInput = "";
    //   this.studentEmailError = "";
    // }
  
    validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
  
    setSelectedIcon(icon: string){
      this.selectedIcon = icon;
    }
  
  
    // createClass() {
    //   this.loading = true;
    //   this.class.studentEmails = [];
    //   this.class.members = 0;
    //   this.class.classIcon = this.selectedIcon;
    //   this.classService.createClassFromDirectorModel(this.class).then((id) => {
    //     // close dialog and update class list
    //     this.loading = false;
    //     this.dialogRef.close({result: 'success', data: {...this.class, id: id}});
    //   })
    // }
  
}
