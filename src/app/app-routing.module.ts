import { NgModule, ViewChild } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { ClassListComponent } from './teacher/class-list/class-list.component';
import { ClassComponent } from './teacher/class/class.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { TeacherGuard } from './shared/guards/teacher.guard';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path: 'classes', component: ClassListComponent, canActivate:[TeacherGuard]},
  {path: 'classes/:classID', component: ClassComponent, canActivate:[TeacherGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
