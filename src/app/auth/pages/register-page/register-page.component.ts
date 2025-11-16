import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  fb = inject(FormBuilder)

  hasError = signal(false);
  isPosting = signal(false);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  onSubmit(){
    if( this.registerForm.invalid ){
      this.hasError.set(true);
      setTimeout( () => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    const { email='', fullName='', password='' } = this.registerForm.value;

    console.log({email, fullName, password});
  }
}
