import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  goalsAssigned: number;
  goalsCompleted: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Anastasia', goalsAssigned: 5, goalsCompleted: 5},
  {name: 'Bob', goalsAssigned: 3, goalsCompleted: 2},
  {name: 'Cheryl', goalsAssigned: 16, goalsCompleted: 0},
];

@Component({
  selector: 'gms-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['name', 'goalsAssigned', 'goalsCompleted'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit() {
  }

}
