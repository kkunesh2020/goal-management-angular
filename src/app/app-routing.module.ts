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

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path: 'goals', component: GoalsComponent, canActivate: [StudentAuthGuard]},
  {path: 'classes', component: ClassListComponent, canActivate: [AuthGuard]},
  {path: 'classes/:classID', component: ClassComponent, canActivate:[ClassAuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
