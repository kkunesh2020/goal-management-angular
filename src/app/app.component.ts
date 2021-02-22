import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'gms-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
    title = 'goal-management-angular';
  constructor(public auth: AuthService) {

  }

}
