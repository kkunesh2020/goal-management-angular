import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DirectorService } from 'src/app/shared/services/director.service';

@Component({
  selector: 'gms-delete-student',
  templateUrl: './delete-student.component.html',
  styleUrls: ['./delete-student.component.scss']
})
export class DeleteStudentComponent implements OnInit {
  loading: boolean = false;
  studentData: any;
  classData: any;
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  public dialogRef: MatDialogRef<DeleteStudentComponent>, private directorService: DirectorService) { }

  ngOnInit() {
    this.studentData = this.dialogData.student;
    this.classData = this.dialogData.class;
  }

  async deleteStudent(){
    this.loading = true;
    console.log("deleting...");
    let returnData = await this.directorService.deleteStudentFromClass(this.classData, this.studentData);
    if(returnData){
      this.dialogRef.close(this.studentData);
    }  
  }

}
