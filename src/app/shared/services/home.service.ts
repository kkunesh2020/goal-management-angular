import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
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
  constructor(private readonly afs: AngularFirestore) {
    this.goalsCollection = afs.collection<any>('goals');
    this.goals = this.goalsCollection.valueChanges();
    this.usersCollection = afs.collection<any>('users');
    this.users$ = this.usersCollection.valueChanges();
  }

  getAddedGoals(): Observable<any> {
    console.log('getting goals: ');
    this.goals.subscribe(result => console.log(result) );
    return this.goals;
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

  async getUserNames(userIds: Array<string>) {
      const usersCollection = this.afs.collection<User>('users');
      let userNames = new Set();
      const reads = userIds.map(id => {
        // grab the user
        const user$ = usersCollection.doc<User>(id).valueChanges();
        // add their name to a set
        user$.subscribe(user => {
          userNames.add({
            id: id,
            name: user.name
          });
        })
      });
      await Promise.all(reads);
      return Array.from(userNames.values());
    }
}
