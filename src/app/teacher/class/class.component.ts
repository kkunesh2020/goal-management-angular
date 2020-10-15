import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Class } from 'src/app/shared/models/class.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClassService } from 'src/app/shared/services/class.service';

@Component({
  selector: 'gms-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  class: Class;
  constructor(private route: ActivatedRoute, private classService: ClassService, private auth: AuthService) {
    this.auth.user$.subscribe(async (userProfile) => {
      const id = this.route.snapshot.paramMap.get('classID');
      if(!userProfile) return;
      console.log("getting class for " + id);
      this.getClass(id, userProfile.uid);
    })

  }

  getClass(id: string, teacherUID: string){
    this.classService.getClass(teacherUID, id).then((data) => {
      console.log("got the data!!!,", data);
      this.class = data;
    });
    console.log("the new class", this.class);
  }

  ngOnInit() {
  }

}
