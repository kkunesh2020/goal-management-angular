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
import { HomeComponent } from './home/home.component';
import { GoalsComponent } from './goals/goals.component';
import { TeacherComponent } from './teacher/teacher.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SideNavbarComponent,
    HomeComponent,
    GoalsComponent,
    TeacherComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
