import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gms-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.scss']
})
export class CreateStudentComponent implements OnInit {
  loading: boolean = false;
  studentData: any = {name: "", email: ""};
  constructor() { }

  ngOnInit() {
  }

  formComplete(): boolean{
    return this.studentData.name.length > 0 && this.studentData.email.length > 0 && this.checkValidEmail();
  }

  checkValidEmail():boolean{
    return true;
  }




}
