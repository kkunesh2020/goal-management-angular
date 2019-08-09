import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/models/user.model';


@Component({
  selector: 'gms-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.scss']
})
export class StudentHomeComponent implements OnInit {
  student: User;
  constructor(private readonly authService: AuthService) {
    this.authService = authService;
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => this.student = user);
  }

}
