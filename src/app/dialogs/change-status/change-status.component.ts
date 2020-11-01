import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'gms-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss']
})
export class ChangeStatusComponent implements OnInit {

  teacherName: string;
  goalTitle: string;
  dueDate: Date;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ChangeStatusComponent>) { 
    this.teacherName = data.createdBy;
    this.goalTitle = data.description;
    this.dueDate = new Date(data.dueDate.seconds * 1000);;
  }

  ngOnInit() {
  }

}
