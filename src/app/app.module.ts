import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './shared/material.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatNativeDateModule} from '@angular/material';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { environment } from 'src/environments/environment';
import {FlexLayoutModule} from '@angular/flex-layout';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { HomeComponent } from './home/home.component';
import { UpdateGoalComponent } from './dialogs/update-goal/update-goal.component';

import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClassListComponent } from './teacher/class-list/class-list.component';
import { ClassComponent } from './teacher/class/class.component';
import { CreateGoalComponent } from './dialogs/create-goal/create-goal.component';
import { EditGoalComponent } from './dialogs/edit-goal/edit-goal.component';
import { GoalsComponent } from './goals/goals.component';
import { DeleteGoalComponent } from './dialogs/delete-goal/delete-goal.component';
import { UploadLinkComponent } from './dialogs/upload-link/upload-link.component';
import { UploaderComponent } from './dialogs/upload-file/uploader/uploader.component';
import { ViewStudentDataComponent } from './teacher/view-student-data/view-student-data.component';
import { GoalDashboardComponent } from './teacher/view-goal-data/goal-dashboard/goal-dashboard.component';
import { StudentBarComponent } from './teacher/view-goal-data/student-bar/student-bar.component';
import { GoalDetailsComponent } from './teacher/view-goal-data/goal-details/goal-details.component';
import { ChangeStatusComponent } from './dialogs/change-status/change-status.component';
import { HelpComponent } from './help/help.component';
import { CreateStudentGoalComponent } from './dialogs/create-student-goal/create-student-goal.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SideNavbarComponent,
    HomeComponent,
    UpdateGoalComponent,
    ClassListComponent,
    ClassComponent,
    CreateGoalComponent,
    EditGoalComponent,
    GoalsComponent,
    DeleteGoalComponent,
    UploadLinkComponent,
    UploaderComponent,
    ViewStudentDataComponent,
    GoalDashboardComponent,
    StudentBarComponent,
    GoalDetailsComponent,
    ChangeStatusComponent,
    HelpComponent,
    CreateStudentGoalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    MaterialModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatPaginatorModule,
    FlexLayoutModule,
    MatMenuModule,
    HttpClientModule,
    RouterModule,
    MatRadioModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [UpdateGoalComponent, CreateGoalComponent, EditGoalComponent,
    DeleteGoalComponent, UploadLinkComponent, UploaderComponent, ChangeStatusComponent, CreateStudentGoalComponent]
})
export class AppModule { }
