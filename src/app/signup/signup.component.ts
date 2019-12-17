import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm = this.fb.group({
    email: ['@gmail.com', [Validators.required, Validators.email]],
    password: ['Password1!', [Validators.required, Validators.minLength(8)]],
    type: ['', [Validators.required]]
  });

  constructor(public authService: AuthService, private fb: FormBuilder) {}

  ngOnInit() {}

  signup() {
  	let data = this.signupForm.value;
    this.authService.signup(data.email, data.password, data.type);
  }

}
