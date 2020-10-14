import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Class } from 'src/app/shared/models/class.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClassService } from '../../shared/services/class.service';

@Component({
  selector: 'gms-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent implements OnInit {
  classes: Class[];
  constructor(private afs: AngularFirestore, private classService: ClassService, private auth: AuthService) {
    this.auth.user$.subscribe(async (userProfile) => {
      if(!userProfile) return;
      this.getClasses(userProfile.uid);
    })
  }

  ngOnInit() {
  }

  getClasses(teacherUID: string){
    this.classes = this.classService.getClasses(teacherUID);
  }

}
