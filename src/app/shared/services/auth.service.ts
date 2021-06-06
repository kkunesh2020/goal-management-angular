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
  userEmail: string = ";"
  githubProfile: any;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private route: Router, private githubService: GithubService) {
    // Get the auth state, then fetch the Firestore user document or return null
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          if(user.email) return this.afs.doc<User>(`users/${user.email}`).valueChanges();
          return this.afs.doc<User>(`users/${this.userEmail}`).valueChanges();
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
    const credential = await this.afAuth.auth.signInWithPopup(provider).catch((err) => {
      console.log("err", err);
      return null;
    });
    if(credential.user){
      await this.updateUserData(credential.user);
    }
    this.route.navigate(['/classes']);
    return;
  }

  async getUserByEmail(email: string): Promise<any>{
    let promise = this.afs.firestore.collection("users").where("email", "==", email).get().then((docSnapshot) => {
      if(docSnapshot.empty){
        return null;
      }
      return {id: docSnapshot.docs[0].id, ...docSnapshot.docs[0].data()};
    })
    return promise;
  }

  async githubSignin() {
    const provider = new auth.GithubAuthProvider();
    provider.addScope('repo');
    provider.setCustomParameters({
      'allow_signup': 'false'
    });    
    const credential: any = await this.afAuth.auth.signInWithPopup(provider);
    this.githubService.githubUsername = credential.additionalUserInfo.username;
    this.githubService.githubProfile = credential.additionalUserInfo.profile;
    this.githubService.userGithubToken = credential.credential.accessToken;
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
  private async updateUserData(user) {
    // Sets user data to firestore on login
    const previousUserData = await this.getUserByEmail(user.email);
    const userRef = this.afs.firestore.doc(`users/${user.email}`);
    console.log("updating", user);
    this.userEmail = user.email;

    const data = {
      name: user.displayName,
      email: user.email,
      accountType: "student",
      goalsAssigned: [],
      goalsCompleted: [],
      classes: []
    };

     // If user doesn't exist yet, set the user as a new document
    userRef.get().then(async(doc) => {
      if (!doc.exists && !previousUserData) {
        userRef.set(data, {merge: true});
      }

      if(previousUserData){
        // just sign in via google func instead of auth 
        await this.afs.firestore.doc(`users/${previousUserData.id}`).update({name: user.displayName });
      }
    });

  }
  // Sign Out Code
  async signOut() {
    await this.afAuth.auth.signOut();
    this.route.navigate(['/']);
  }
}
