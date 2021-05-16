import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DirectorService } from 'src/app/shared/services/director.service';

@Component({
  selector: 'gms-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.scss']
})
export class CreateStudentComponent implements OnInit {
  loading: boolean = false;
  studentData: any = {name: "", email: ""};
  errorMessage:string = "";
  constructor(
    private director: DirectorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateStudentComponent>
    ) { }

  ngOnInit() {
  }

  formComplete(): boolean{
    return this.studentData.name.length > 0 && this.studentData.email.length > 0;
  }

  checkValidEmail(email: string):boolean{
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(String(email).toLowerCase())){
      this.errorMessage = "Please enter a valid email address";
      return false;
    }
    this.errorMessage = "";
    return true;
  }

  checkChadwickEmail(email: string){
    if(!/@chadwickschool\.org$/.test(email)){
      this.errorMessage = "Email must be a valid Chadwick email";
      return false;
    }
    this.errorMessage = "";
    return true;
  }

  createStudent(){
    if(this.checkValidEmail(this.studentData.email) && this.checkChadwickEmail(this.studentData.email)){
      this.loading = true;
      this.director.createStudentForClass(this.data.id, this.studentData).then(() => {
        // close dialog
      }).catch((err) => {
        alert("Something went wrong. Please try again");
      })
    }
  }


}
