import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from '../models/user.model';
import { auth } from 'firebase';
import { GithubService } from './github.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;
  userGithubID: string;
  githubUsername = '';
  githubProfile: any;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private route: Router, private githubService: GithubService) {
    // Get the auth state, then fetch the Firestore user document or return null
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          console.log('logged in');
          console.log(this.afAuth.user.subscribe(userdata => {
            console.log(userdata);
          }));
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

  async githubSignin() {
    const provider = new auth.GithubAuthProvider();
    const credential: any = await this.afAuth.auth.signInWithPopup(provider);
    this.updateUserData(credential.user);
    this.userGithubID = credential.credential.accessToken;
    this.githubUsername = credential.additionalUserInfo.username;
    this.githubProfile = credential.additionalUserInfo.profile;
    this.setGithubInfo(this.githubUsername, this.githubProfile, this.userGithubID);
    console.log('user repos', this.githubService.viewUserRepos());
    return;
  }

  setGithubInfo(username, profile, id) {
    this.githubService.githubProfile = profile;
    this.githubService.githubUsername = username;
    this.githubService.userGithubToken = id;
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

     // If user doesn't exist yet, set the user as a new document
    userRef.get().then((doc) => {
      if (!doc.exists) {
        userRef.set(data, {merge: true});
      }
    });

  }
  // Sign Out Code
  async signOut() {
    await this.afAuth.auth.signOut();
    this.route.navigate(['/']);
  }
}
