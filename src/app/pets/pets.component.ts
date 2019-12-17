import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../auth.service';

export interface Pet { 
	id:string,
	nombre:string,
	animal:string,
	raza:string,
	dueno:object,
	foto:string
}

export interface User { 
	id:string,
	nombre:string,
	role:string,
	username:string
}

@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.scss']
})
export class PetsComponent implements OnInit {
  private petsCollection: AngularFirestoreCollection<Pet>;
  private usersCollection: AngularFirestoreCollection<User>;
  uploadingImage = false;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  selectedDueno = null;
  edit = false;
  petsList: Observable<Pet[]>;
  usersList: Observable<User[]>;
  displayedColumns: string[] = ['nombre','animal','raza','dueno','foto','accion'];

  petForm = this.fb.group({
  	id: ['',],
  	nombre: ['', [Validators.required]],
  	animal: ['', [Validators.required]],
  	raza: ['', [Validators.required]],
  	dueno: ['', [Validators.required]],
  	foto: ['', [Validators.required]]
  });

  constructor(
  	private afs: AngularFirestore, private fb: FormBuilder,
  	private storage: AngularFireStorage, public authService: AuthService) {
    
    if (this.authService.profile.role == 'client') {
      this.petsCollection = this.afs.collection<Pet>('pets', ref => ref.where('dueno', '==', this.authService.profile.username));
      this.usersCollection = this.afs.collection<User>('users', ref => ref.where('username', '==', this.authService.profile.username));
      this.selectedDueno = this.authService.profile.username;
      this.petForm.controls['dueno'].setValue(this.authService.profile.username);
    } else {
      this.petsCollection = this.afs.collection<Pet>('pets', ref => ref.orderBy('dueno'));
      this.usersCollection = this.afs.collection<User>('users', ref => ref.orderBy('username'));
    }
    
    this.petsList = this.petsCollection.valueChanges();
    this.usersList = this.usersCollection.valueChanges();
  }

  ngOnInit() {}

  addPet() {
	  	let data = this.petForm.value;
	  	this.petsCollection
	  	.add(data)
	  	.then((docRef) => {
	      this.petsCollection.doc(docRef.id).update({
	        id: docRef.id
	      });
	      this.selectedDueno = null;
	      this.petForm.reset();
	    })
	    .catch((err) => {
	      console.log(err);
	    });
  }

  updatePet() {
  	let data = this.petForm.value;
  	this.petsCollection
  	.doc(data.id)
  	.update(data)
  	.then((docRef) => {
      this.petForm.reset();
	  this.edit = false;
	  this.selectedDueno = null;
    })
    .catch((err) => {
      console.log(err);
    });
  	
  }

  selectDueno(e){
  	this.selectedDueno = e.value;
  	this.petForm.controls['dueno'].setValue(e.value);
  }

  uploadFile(event) {
	  	this.uploadingImage = true;
	    const file = event.target.files[0];
	    const filePath = "pet-" + new Date().getTime();
	    const ref = this.storage.ref(filePath);
	    const task = ref.put(file);
	    // observe percentage changes
	    this.uploadPercent = task.percentageChanges();
	    // get notified when the download URL is available
	    task.snapshotChanges().pipe(
	        finalize(() => {
	        	ref.getDownloadURL().subscribe(data => {
	        		this.uploadingImage = false;
	        		this.petForm.controls['foto'].setValue(data);
	        		event.value = "";
	        	});
	        	
	        })
	    )
	    .subscribe()
  }

  editar(el) {
  	this.petForm.controls['id'].setValue(el.id);
  	this.petForm.controls['nombre'].setValue(el.nombre);
  	this.petForm.controls['raza'].setValue(el.raza);
  	this.petForm.controls['animal'].setValue(el.animal);
  	this.selectedDueno = el.dueno;
  	this.petForm.controls['dueno'].setValue(el.dueno);
  	this.petForm.controls['foto'].setValue(el.foto);
  	this.edit = true;
  }

  eliminar(el) {
  	this.petsCollection.doc(el.id).delete();
  }

  clear() {
  	this.selectedDueno = null;
  	this.petForm.reset();
	  this.edit = false;
  }
}
