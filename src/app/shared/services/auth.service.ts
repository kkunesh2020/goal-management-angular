import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from '../models/user.model';
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private route: Router) {
    // Get the auth state, then fetch the Firestore user document or return null
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    );
  }

  /**
   * Opens popup, signs user into google account, and adds user data to firebase
   */
  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    this.updateUserData(credential.user);
    this.route.navigate(['/classes']);
    return;
  }

  /**
   * adds user data to firebase after login
   * @param user -
   */
  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef = this.afs.firestore.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      isAdmin: false,
      goalsAssigned: [],
      goalsCompleted: [],
      classes: []
    };

    userRef.get().then((doc) => {
      if(!doc.exists){
        userRef.set(data, {merge: true});
      }
    })

  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.route.navigate(['/']);
  }
}
