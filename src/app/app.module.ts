import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './shared/material.module';
import { AppComponent } from './app.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NavbarComponent } from './navbar/navbar.component';
import { environment } from 'src/environments/environment';
import {FlexLayoutModule} from '@angular/flex-layout';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { HomeComponent } from './home/home.component';
import { UpdateGoalComponent } from './dialogs/update-goal/update-goal.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SideNavbarComponent,
    HomeComponent,
    UpdateGoalComponent
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
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [UpdateGoalComponent]
})
export class AppModule { }
