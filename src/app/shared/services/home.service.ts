import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  /**
   * A collection of goals stored in the firestore database.
   */
  private goalsCollection: AngularFirestoreCollection<any>;
  /**
   * The array of goals in the firestore database.
   */
  goals: Observable<any[]>;
  /**
   * A collection of users stored in the firestore database.
   */
  private usersCollection: AngularFirestoreCollection<any>;
  /**
   * The array of users in the firestore database.
   */
  users$: Observable<any[]>;
  /**
   * The id of the current student.
   */
  currentStudentId: string;
  /**
   * Sets the global variables to the data from the firestore database.
   * @param afs the firestore database
   */
  constructor(private readonly afs: AngularFirestore) {
    this.goalsCollection = afs.collection<any>('goals');
    this.goals = this.goalsCollection.valueChanges();
    this.usersCollection = afs.collection<any>('users');
    this.users$ = this.usersCollection.valueChanges();
  }

  /**
   * Gets all the goals added to the database.
   */
  getAddedGoals(): Observable<any> {
    console.log('getting goals: ');
    this.goals.subscribe(result => console.log(result));
    return this.goals;
  }

  /**
   * Gets all the goals assigned to the current student from the database.
   */
  getUserGoals(): Observable<any> {
    console.log(this.currentStudentId);
    return this.afs
      .collection('goals', ref =>
        ref.where('assignedTo', '==', this.currentStudentId)
      )
      .valueChanges();
  }

  /**
   * Returns the user from the database with a given userId.
   * @param userId the given userId
   */
  getUser(userId: string): Observable<User> {
    return this.afs.doc<User>(`users/` + userId).valueChanges();
  }

  // getUserName(userId: string) : string {
  //   console.log('User id is ' + userId);
  //   let userName = '';
  //   this.users$.subscribe(users => {
  //     console.log('Users from the database are');
  //     console.log(users)
  //     const user = users.find(user => user.uid === userId);
  //     console.log('User found is ');
  //     console.log(user);
  //     userName = user.name;
  //   })
  //   console.log('User name is ' + userName);
  //   return userName;
  // }

  // Helper: Reads an array of IDs from a collection concurrently
  // readIds = async (ids: Array<string>) => {
  //   const reads = ids.map(id => this.afs.collection<User>('users').doc(id).get() );
  //   const result = await Promise.all(reads);
  //   return result.map(v => v.data());
  // }

  /**
   * Gets all the users from the database given their ids.
   * @param userIds an array of all the given user Ids.
   */
  async getUsers(userIds: Array<string>): Promise<Array<Observable<User>>> {
    const usersCollection = this.afs.collection<User>('users');
    console.log('collection: ' + usersCollection);
    console.log('userID:' + userIds);
    const users = [];
    const reads = userIds.map(id => {
      // grab the user
      users.push(usersCollection.doc<User>(id).valueChanges());
    });
    await Promise.all(reads);
    return users;
  }

  // async getUserNames(userIds: Array<string>) {
  //   const usersCollection = this.afs.collection<User>('users');
  //   const userNames = new Set();
  //   const reads = userIds.map(id => {
  //     const user$ = usersCollection.doc<User>(id).valueChanges();
  //     user$.toPromise().then(user => {
  //       console.log('adding user');
  //       userNames.add({
  //         id: user.uid,
  //         name: user.name
  //       });
  //     });
  //   });
  //   console.log(userNames);
  //   await Promise.all(reads);
  //   return Array.from(userNames.values());
  // }

  /**
   * Returns all the usernames corresponding with the given user Ids.
   * @param userIds an array of all the given user Ids.
   */
  async getUserNames(userIds: Array<string>) {
    const usersCollection = this.afs.collection<User>('users');
    const userNames = new Set();
    const reads = userIds.map(id => {
      // grab the user
      const user$ = usersCollection.doc<User>(id).valueChanges();
      user$.subscribe(user => {
        console.log('adding user');
        userNames.add({
          id: user.uid,
          name: user.name
        });
      });
    });
    await Promise.all(reads);
    console.log(userNames); // is empty because subscribe hasn't emitted
    return userNames;
  }
}
