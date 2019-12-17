import { Component, OnInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MatDatepickerInputEvent } from '@angular/material';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../auth.service';

export interface Appointment { 
	id:string,
	dueno:string,
	mascota:string,
	fecha:string,
	hora:string,
}

export interface User {
	id:string,
	nombre:string,
	role:string,
	username:string
}

export interface Pet { 
	id:string,
	nombre:string,
	animal:string,
	raza:string,
	dueno:object,
	foto:string
}





@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  private appointmentsCollection: AngularFirestoreCollection<Appointment>;
  private usersCollection: AngularFirestoreCollection<User>;
  private petsCollection: AngularFirestoreCollection<Pet>;
  Date = Date;
  selectedDueno = null;
  edit = false;
  appointmentsList: Observable<Appointment[]>;
  usersList: Observable<User[]>;
  displayedColumns: string[] = ['fecha','hora','dueno','mascota','accion'];
  date = null;
  serializedDate = null;
  appoinmentForm = this.fb.group({
  	id: ['',],
	fecha: ['', [Validators.required]],
	hora: ['', [Validators.required]],
	mascota: ['', [Validators.required]],
	dueno: ['', [Validators.required]]
  });

  constructor(
  	private afs: AngularFirestore, private fb: FormBuilder,
  	private storage: AngularFireStorage, public authService: AuthService) {
  	this.date = new FormControl(new Date());
  	this.serializedDate = new FormControl((new Date()).toISOString());
  }

  ngOnInit() {
      if (this.authService.profile.role == 'client') {
      	this.appointmentsCollection = this.afs.collection<Appointment>(
      		'appointments', ref => ref.where('dueno', '==', this.authService.profile.username));
        this.petsCollection = this.afs.collection<Pet>('pets', ref => ref.where('dueno', '==', this.authService.profile.username));
        this.usersCollection = this.afs.collection<User>('users', ref => ref.where('username', '==', this.authService.profile.username));
        this.selectedDueno = this.authService.profile.username;
        this.appoinmentForm.controls['dueno'].setValue(this.authService.profile.username);
      } else {
      	this.appointmentsCollection = this.afs.collection<Appointment>('appointments', ref => ref.orderBy('fecha'));
        this.petsCollection = this.afs.collection<Pet>('pets', ref => ref.orderBy('dueno'));
        this.usersCollection = this.afs.collection<User>('users', ref => ref.orderBy('username'));
      }
      this.appointmentsList =  this.appointmentsCollection.valueChanges();
      this.petsList = this.petsCollection.valueChanges();
      this.usersList = this.usersCollection.valueChanges();
  }


  add() {
	  	let data = this.appoinmentForm.value;
	  	this.appointmentsCollection
	  	.add(data)
	  	.then((docRef) => {
	      this.appointmentsCollection.doc(docRef.id).update({
	        id: docRef.id
	      });
	      this.selectedDueno = null;
	      this.appoinmentForm.reset();
	    })
	    .catch((err) => {
	      console.log(err);
	    });
  }

  update() {
  	let data = this.appoinmentForm.value;
  	this.appointmentsCollection
  	.doc(data.id)
  	.update(data)
  	.then((docRef) => {
      this.appoinmentForm.reset();
	  this.edit = false;
	  this.selectedDueno = null;
    })
    .catch((err) => {
      console.log(err);
    });
  	
  }

  selectDueno(e){
  	this.selectedDueno = e.value;
  	this.appoinmentForm.controls['dueno'].setValue(e.value);
  }


  editar(el) {
  	this.appoinmentForm.controls['id'].setValue(el.id);
  	this.appoinmentForm.controls['fecha'].setValue(el.fecha);
  	this.appoinmentForm.controls['hora'].setValue(el.hora);
  	this.appoinmentForm.controls['mascota'].setValue(el.mascota);
  	this.selectedDueno = el.dueno;
  	this.appoinmentForm.controls['dueno'].setValue(el.dueno);
  	this.edit = true;
  }

  eliminar(el) {
  	this.appointmentsCollection.doc(el.id).delete();
  }

  clear() {
  	this.selectedDueno = null;
  	this.appoinmentForm.reset();
	  this.edit = false;
  }
}
