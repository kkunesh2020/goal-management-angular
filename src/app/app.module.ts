import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './shared/material.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { environment } from 'src/environments/environment';
import {FlexLayoutModule} from '@angular/flex-layout';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { HomeComponent } from './home/home.component';
import { UpdateGoalComponent } from './dialogs/update-goal/update-goal.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StudentTableComponent } from './teacher/student-table/student-table.component';
import { ClassListComponent } from './teacher/class-list/class-list.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SideNavbarComponent,
    HomeComponent,
    UpdateGoalComponent,
    StudentTableComponent,
    ClassListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    MaterialModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    MatProgressSpinnerModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [UpdateGoalComponent]
})
export class AppModule { }
