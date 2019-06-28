import { Component, OnInit } from '@angular/core';
import { User } from '../shared/models/user.model';
import { TestUtils } from '../shared/models/test-utils';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

}
