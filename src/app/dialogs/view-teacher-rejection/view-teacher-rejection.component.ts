import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'gms-view-teacher-rejection',
  templateUrl: './view-teacher-rejection.component.html',
  styleUrls: ['./view-teacher-rejection.component.scss']
})
export class ViewTeacherRejectionComponent implements OnInit {
  declinedNote: string = "";
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.declinedNote = this.data.declinedNote;
  }

}
