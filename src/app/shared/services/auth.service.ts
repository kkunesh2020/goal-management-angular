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

  /**
   * The current user.
   */
  user$: Observable<User>;
  currentUserId: string;
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    // Get the auth state, then fetch the Firestore user document or return null
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          this.currentUserId = user.uid;
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    );
  }

  /**
   * Opens popup, signs user into google account, and adds user data to firebase.
   */
  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  /**
   * Adds user data to firebase after login.
   * @param user -
   */
  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const data = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      isAdmin: false,
      goalsAssigned: 0,
      goalsCompleted: 0
    };

    return userRef.set(data, { merge: true });
  }

  getCurrentUser(): Observable<User> {
    return this.user$;
  }
  /**
   * Signs the user out.
   */
  async signOut() {
    await this.afAuth.auth.signOut();
    // this.router.navigate(['/']);
  }
}
