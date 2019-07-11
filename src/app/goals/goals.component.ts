import { Component, OnInit } from '@angular/core';
import { StudentTableService } from '../shared/services/student-table.service';
import { Observable, of } from 'rxjs';
import { browser } from 'protractor';
import { Goal } from '../shared/models/goal.model';

@Component({
  selector: 'gms-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})

export class GoalsComponent implements OnInit {

  /**
   * columns displayed in the table.
   */
  goalsDisplayedColumns: string[] = [
    'description',
    'dueDate',
    'isCompleted',
    'createdBy'
  ];

  /**
   * The array of all goals.
   */
  goalsDataSource: Array<Goal>;

  /**
   * The array of usernames.
   */
  userNames = [];

  /**
   * If the goals data has been recieved from the database.
   */
  dataReceived = false;


  constructor(private studentTableService: StudentTableService) {}

  ngOnInit() {
    this.showGoals();
  }

  /**
   * Retrieves the goals of the selected user from the database;
   * creates a username dictionary
   */
  showGoals() {
    this.studentTableService.getUserGoals().subscribe(goals => {
      this.goalsDataSource = goals;
      this.createUserNameDictionary(this.goalsDataSource);
    });
  }

  /**
   * Creates a username dictionary.
   * @param goals the given goals
   */
  createUserNameDictionary(goals: Array<Goal>): void {
    const createdByIDs = [];
    goals.map(goal => {
      createdByIDs.push(goal.createdBy);
    });
    this.studentTableService.getUserNames(createdByIDs).then(result => {
      // this.userNames = result;
      this.dataReceived = true;
    });
  }

  /**
   * Gets the username of a user given the user ID.
   * @param userId the given user ID
   */
  getUserName(userId: string): string {
    if (this.userNames.length) {
      return this.userNames.find(element => element.userId === userId)
        .name;
    }
    return '';
  }
}
