import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from 'firebase';


@Injectable({
  providedIn: 'root'
})

export class HomeService {
  private goalsCollection: AngularFirestoreCollection<any>;
  goals: Observable<any[]>;
  private usersCollection: AngularFirestoreCollection<any>;
  users: Observable<any[]>;
  constructor(private readonly afs: AngularFirestore) {
    this.goalsCollection = afs.collection<any>('goals');
    this.goals = this.goalsCollection.valueChanges();
    this.usersCollection = afs.collection<any>('users');
    this.users = this.usersCollection.valueChanges();
  }

  getAddedGoals(): Observable<any> {
    this.goals.subscribe(result => console.log(result) );
    return this.goals;
  }

  getUser(userId: string): Observable<any> {
    return this.afs.doc<User>(`users/` + userId).valueChanges();
  }
}
