import { NgModule, ViewChild } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SideNavbarComponent } from './navigation/side-navbar/side-navbar.component';
import { GoalsComponent } from './goals/goals.component';
import { StudentTableComponent } from './student-table/student-table.component';
import { TeacherComponent } from './teacher/teacher.component';
import { GuestComponent } from './guest/guest.component';

const routes: Routes = [
  {path: '', component: GuestComponent},
  {path: 'goals', component: GoalsComponent },
  {path: 'addGoals', component: TeacherComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
