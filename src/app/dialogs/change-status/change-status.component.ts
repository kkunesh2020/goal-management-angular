import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GoalService } from 'src/app/shared/services/goal.service';
import { NbDialogRef, NbDialogService } from '@nebular/theme';

@Component({
  selector: 'gms-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss']
})
export class ChangeStatusComponent implements OnInit {
  loading: boolean;
  teacherName: string;
  studentName: string;
  goalTitle: string;
  dueDate: Date;
  rejected: boolean;
  public data: any;
  rejectionNote: string;

  constructor(
    public dialogRef: NbDialogRef<ChangeStatusComponent>,
    private goalService: GoalService) {
  }

  ngOnInit(){
    this.loading = true;
    if(this.data.createdBy.accountType == "teacher"){
      this.teacherName = this.data.createdBy.name;
    }else{
      this.studentName = this.data.createdBy.name;
    }
    
    this.goalTitle = this.data.description;
    this.dueDate = this.data.dueDate.toDate();
    this.loading = false;
    this.rejectionNote = '';
  }

  rejectGoal(status: boolean) {
    this.rejected = status;
  }

  updateStatus(status: string) {
    this.loading = true;
    this.goalService.updateGoalStatus(this.data.id, status, this.data.email, this.rejectionNote).then(() => {
      this.dialogRef.close('updated');
    });
  }

}
