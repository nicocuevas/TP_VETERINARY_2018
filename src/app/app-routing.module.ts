import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { PetsComponent } from './pets/pets.component';
import { AppointmentsComponent } from './appointments/appointments.component';

import { AuthGuardService } from './auth-guard.service';


const routes: Routes = [
	{ path: '',      component: LoginComponent },
	{ path: 'signup',      component: SignupComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
    { path: 'pets', component: PetsComponent, canActivate: [AuthGuardService] },
    { path: 'appoinments', component: AppointmentsComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
