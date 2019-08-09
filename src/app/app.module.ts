import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FlexLayoutModule } from '@angular/flex-layout';


import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './shared/material.module';


import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navigation/navbar/navbar.component';
import { SideNavbarComponent } from './navigation/side-navbar/side-navbar.component';
import { StudentTableComponent } from './student-table/student-table.component';
import { GoalsComponent } from './goals/goals.component';
import { TeacherComponent } from './teacher/teacher.component';
import { RouterModule } from '@angular/router';
import { GuestComponent } from './guest/guest.component';
import { TodaysGoalComponent } from './todays-goal/todays-goal.component';
import { StudentHomeComponent } from './student-home/student-home.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SideNavbarComponent,
    StudentTableComponent,
    GoalsComponent,
    TeacherComponent,
    GuestComponent,
    TodaysGoalComponent,
    StudentHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FlexLayoutModule,
    RouterModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
