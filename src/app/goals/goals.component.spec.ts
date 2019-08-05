import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsComponent } from './goals.component';
import { MaterialModule } from '../shared/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';

// describe('GoalsComponent', () => {
//   let component: GoalsComponent;
//   let fixture: ComponentFixture<GoalsComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [GoalsComponent],
//       imports: [MaterialModule,
//         NoopAnimationsModule,
//         MaterialModule,
//         AngularFireModule.initializeApp(environment.firebaseConfig),
//         AngularFirestoreModule,
//         AngularFireAuthModule,]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(GoalsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
