import { Component, OnInit } from '@angular/core';
import { HomeService } from '../shared/services/home.service';
import { Observable } from 'rxjs';
import { User } from '../shared/models/user.model';
import { Goal } from '../shared/models/goal.model';
import { Router } from '@angular/router';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';


const ELEMENT_DATA: User[] = [
  {uid: '39aneZGNNmfA5wOqZf1yb48LxuP2', name: 'Anastasia', email: 'smenzelos2023@chadwickschool.org',
   isAdmin: false, goalsAssigned: 5, goalsCompleted: 5},
  {uid: 'SFyyskdkeERiwVJmHx0Bi2HNxg62', name: 'Bob', email: 'jdulai2020@chadwickschool.org',
   isAdmin: false, goalsAssigned: 3, goalsCompleted: 1},
  {uid: 'iyv2OTl7APb3gDqJKJuvFLPXozB3', name: 'Cheryl', email: 'kkunesh2020@chadwickschool.org',
   isAdmin: false, goalsAssigned: 10, goalsCompleted: 5},
];

@Component({
  selector: 'gms-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['name', 'goalsAssigned', 'goalsCompleted'];
  dataSource = ELEMENT_DATA;
  userNames = [];
  // userNames = [
  //   {userId: 'mR9T1tHEwVcQbbUScFGY4TFqz0j2', name: 'J.D. DeVaughn-Brown'},
  //   {userId: 'SFyyskdkeERiwVJmHx0Bi2HNxg62', name: 'Jacob Dulai'},
  //   {userId: 'iyv2OTl7APb3gDqJKJuvFLPXozB3', name: 'Katie Kunesh'}
  // ]

  constructor(private homeService: HomeService, private router: Router) { }

  ngOnInit() {
    // this.showGoals();
  }

  showGoals() {
    // this.homeService.getAddedGoals().subscribe( goals => {
    //   this.goalsDataSource = goals;
    // });
    // console.log(this.goalsDataSource);
  }

  openGoals(uid: string) {
      this.router.navigateByUrl('/goals');
      this.homeService.currentStudent = uid;
  }
}
