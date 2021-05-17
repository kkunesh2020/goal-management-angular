import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'gms-delete-student',
  templateUrl: './delete-student.component.html',
  styleUrls: ['./delete-student.component.scss']
})
export class DeleteStudentComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public studentData: any,
  public dialogRef: MatDialogRef<DeleteStudentComponent>) { }

  ngOnInit() {
  }

  deleteStudent(){

  }

}
