import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'gms-goal-dashboard',
  templateUrl: './goal-dashboard.component.html',
  styleUrls: ['./goal-dashboard.component.scss']
})
export class GoalDashboardComponent {
  loading: boolean;
  classID: string;
  goalID: string;

  constructor(private route: ActivatedRoute, private auth: AuthService, private router: Router) {
    this.loading = true;
    this.auth.user$.subscribe(async (userProfile) => {
      this.classID = this.route.snapshot.paramMap.get('classID');
      this.goalID = this.route.snapshot.paramMap.get('goalID');
      if(!userProfile) { return; }
    });
    this.loading = false;
  }

  navigateBack(){
    this.router.navigate([`classes/${this.classID}`]);
  }

}
