import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbDialogRef, NbDialogService } from '@nebular/theme';

@Component({
  selector: 'gms-view-teacher-rejection',
  templateUrl: './view-teacher-rejection.component.html',
  styleUrls: ['./view-teacher-rejection.component.scss']
})
export class ViewTeacherRejectionComponent implements OnInit {
  declinedNote: any;
  data: any;
  constructor(@Optional() protected ref: NbDialogRef<ViewTeacherRejectionComponent>) { }

  ngOnInit() {
    this.declinedNote = this.data.declinedMessages[0];
  }

  closeDialog(){
    this.ref.close();
  }

}
