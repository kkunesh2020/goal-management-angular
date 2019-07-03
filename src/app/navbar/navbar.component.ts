import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { User } from '../shared/models/user.model';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'gms-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

}
