import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Class } from 'src/app/shared/models/class.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClassService } from 'src/app/shared/services/class.service';

@Component({
  selector: 'gms-goal-dashboard',
  templateUrl: './goal-dashboard.component.html',
  styleUrls: ['./goal-dashboard.component.scss']
})
export class GoalDashboardComponent {
  loading: boolean;
  classID: string;
  teacherID: string;
  goalID: string;
  class: Class;

  constructor(private route: ActivatedRoute, private auth: AuthService, private router: Router, private classService: ClassService) {
    this.loading = true;
    this.auth.user$.subscribe(async (userProfile) => {
      this.classID = this.route.snapshot.paramMap.get('classID');
      this.goalID = this.route.snapshot.paramMap.get('goalID');
      this.teacherID = userProfile.uid;
      this.getClass(this.classID, this.teacherID);
      console.log("got the teacher data", this.teacherID);
      if(!userProfile) { return; }
    });
    this.loading = false;
  }

  navigateBack(){
    this.router.navigate([`classes/${this.classID}`]);
  }

  getClass(id: string, teacherUID: string): Promise<any>{
    let promise = this.classService.getClass(teacherUID, id).then((data) => {
      this.class = data;
    });
    return promise;
  }

}
