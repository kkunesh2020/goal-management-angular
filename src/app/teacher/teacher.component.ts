import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'gms-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  teacherName: string;
  constructor(private authService: AuthService) { }

  ngOnInit() {

  }

  // showName() {
  //   return this.authService.userName;

  // }

}
