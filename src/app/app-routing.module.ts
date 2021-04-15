import { NgModule, ViewChild } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { ClassListComponent } from './teacher/class-list/class-list.component';
import { ClassComponent } from './teacher/class/class.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ClassAuthGuard } from './shared/guards/class-auth.guard';
import { StudentAuthGuard } from './shared/guards/student-auth.guard';
import { GoalsComponent } from './goals/goals.component';
import { TeacherAuthGuard } from './shared/guards/teacher-auth.guard';
import { ViewStudentDataComponent } from './teacher/view-student-data/view-student-data.component';
import { GoalDashboardComponent } from './teacher/view-goal-data/goal-dashboard/goal-dashboard.component';
import { HelpComponent } from './help/help.component';
import { CreateClassComponent } from './dialogs/create-class/create-class.component';
import { DirectorComponent } from './director/director.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'goals', component: GoalsComponent, canActivate: [StudentAuthGuard]},
  {path: 'help', component: HelpComponent},
  {path: 'directorview', component: DirectorComponent},
  {path: 'classes', component: ClassListComponent, canActivate: [AuthGuard]},
  {path: 'classes/:classID', component: ClassComponent, canActivate: [ClassAuthGuard]},
  {path: 'classes/:classID/students/:studentID', component: ViewStudentDataComponent, canActivate: [ClassAuthGuard, TeacherAuthGuard]},
  {path: 'classes/:classID/goals/:goalID', component: GoalDashboardComponent, canActivate: [ClassAuthGuard, TeacherAuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
