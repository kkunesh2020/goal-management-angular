import { Component, OnInit } from '@angular/core';
import { HomeService } from '../shared/services/home.service';
import { Observable } from 'rxjs';
import { UpdateGoalComponent } from '../dialogs/update-goal/update-goal.component';
import {MatDialog} from '@angular/material/dialog';
import { AuthService } from '../shared/services/auth.service';


@Component({
  selector: 'gms-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loggedIn: boolean = false;
  loading: boolean = true;


  constructor(private homeService: HomeService, public dialog: MatDialog, public auth: AuthService) {
    this.auth.user$.subscribe(async (userProfile) => {
      userProfile == null ? this.loggedIn = false : this.loggedIn = true;
      this.loading = false;
    })
   }

  ngOnInit() {

  }


}
