import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signinForm = this.fb.group({
    email: ['dojang.avellaneda@gmail.com', [Validators.required, Validators.email]],
    password: ['Password1!', [Validators.required, Validators.minLength(8)]]
  });

  constructor(public authService: AuthService, private fb: FormBuilder) {}

  ngOnInit() {}

  signup() {
    // this.authService.signup(this.email, this.password);
    // this.email = this.password = '';
  }

  login() {
  	let data = this.signinForm.value;
    this.authService.login(data.email, data.password);
    this.email = this.password = '';
  }

  

}
