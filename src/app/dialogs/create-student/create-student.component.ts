import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { startWith } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { DirectorService } from 'src/app/shared/services/director.service';

@Component({
  selector: 'gms-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.scss']
})
export class CreateStudentComponent implements OnInit {
  loading: boolean = false;
  userValue = new FormControl();
  studentData: User[] = [];
  filteredOptions: Observable<User[]>;
  errorMessage:string = "";
  constructor(
    private director: DirectorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateStudentComponent>
    ) { }

  ngOnInit() {
    this.director.getAllStudentData().then((result) => {
      this.studentData = result;
      console.log("student data", this.studentData);
    });

    this.filteredOptions = this.userValue.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.studentData.slice())
      );
  }

  formComplete(): boolean{
    return this.userValue.value && this.userValue.value.email != null;
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    console.log("calling", name);
    const filterValue = name.toLowerCase();

    return this.studentData.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }


  createStudent(){
      this.loading = true;
      this.director.createStudentForClass(this.data.id, this.userValue.value).then((result) => {
        // close dialog
        if(this.data){
          console.log("closing with", this.data);
          this.dialogRef.close(this.userValue.value);
        }else{
          this.dialogRef.close();
        }
      }).catch((err) => {
        alert("Something went wrong. Please try again");
      })
  }


}
