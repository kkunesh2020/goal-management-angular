import { Component, OnInit } from '@angular/core';
import { StudentTableService } from '../shared/services/student-table.service';
import { Observable } from 'rxjs';
import { User } from '../shared/models/user.model';
import { Goal } from '../shared/models/goal.model';
import { Router } from '@angular/router';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';


/**
 * Test User data.
 */
const ELEMENT_DATA: User[] = [
  {uid: '39aneZGNNmfA5wOqZf1yb48LxuP2', name: 'Anastasia', email: 'smenzelos2023@chadwickschool.org',
   isAdmin: false, goalsAssigned: 5, goalsCompleted: 5},
  {uid: 'SFyyskdkeERiwVJmHx0Bi2HNxg62', name: 'Bob', email: 'jdulai2020@chadwickschool.org',
   isAdmin: false, goalsAssigned: 3, goalsCompleted: 1},
  {uid: 'iyv2OTl7APb3gDqJKJuvFLPXozB3', name: 'Cheryl', email: 'kkunesh2020@chadwickschool.org',
   isAdmin: false, goalsAssigned: 10, goalsCompleted: 5},
];

@Component({
  selector: 'gms-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss']
})
export class StudentTableComponent implements OnInit {
  /**
   * columns displayed in the table.
   */
  displayedColumns: string[] = ['name', 'goalsAssigned', 'goalsCompleted'];
  /**
   * Stores the test user data.
   */
  dataSource = ELEMENT_DATA;
  /**
   * The array of usernames
   */
  userNames = [];

  constructor(private studentTableService: StudentTableService, private router: Router) { }

  ngOnInit() {

  }

  /**
   * Opens the goal component and sets the current student's id in home service.
   * @param uid the given user id.
   */
  openGoals(uid: string) {
      this.router.navigateByUrl('/goals');
      this.studentTableService.currentStudentId = uid;
  }
}
