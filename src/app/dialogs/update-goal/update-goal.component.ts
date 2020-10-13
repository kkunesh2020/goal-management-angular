import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'gms-update-goal',
  templateUrl: './update-goal.component.html',
  styleUrls: ['./update-goal.component.scss']
})
export class UpdateGoalComponent implements OnInit{

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {

   }
  ngOnInit(): void {

  }

}
