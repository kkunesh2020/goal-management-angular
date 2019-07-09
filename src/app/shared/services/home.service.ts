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
  private goalsCollection: AngularFirestoreCollection<any>;
  goals: Observable<any[]>;
  private usersCollection: AngularFirestoreCollection<any>;
  users$: Observable<any[]>;
  currentStudent: string;
  constructor(private readonly afs: AngularFirestore) {
    this.goalsCollection = afs.collection<any>('goals');
    this.goals = this.goalsCollection.valueChanges();
    this.usersCollection = afs.collection<any>('users');
    this.users$ = this.usersCollection.valueChanges();
  }

  getAddedGoals(): Observable<any> {
    console.log('getting goals: ');
    this.goals.subscribe(result => console.log(result));
    return this.goals;
  }

  getUserGoals(): Observable<any> {
    console.log(this.currentStudent);
    return this.afs
      .collection('goals', ref =>
        ref.where('assignedTo', '==', this.currentStudent)
      )
      .valueChanges();
  }

  getUser(userId: string): Observable<User> {
    return this.afs.doc<User>(`users/` + userId).valueChanges();
  }

  getAssignedTo(assignedTo: string): Observable<User> {
    return this.afs.doc<User>(`goals/` + assignedTo).valueChanges();
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
  //   const users$ = await this.getUsers(userIds);
  //   const userNames = new Set();
  //   users$.forEach(user$ => {
  //     user$.toPromise().then(
  //       user => {
  //         console.log('adding user');
  //         userNames.add({
  //           id: user.uid,
  //           name: user.name
  //         });
  //       }
  //     );
  //   });
  //   console.log(userNames);
  //   return Array.from(userNames.values());
  // }

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
