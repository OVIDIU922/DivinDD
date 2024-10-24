import { Component } from '@angular/core';
import { RegistrationService } from '../services/registration.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { User } from '../models/user';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule, FooterComponent],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private registrationService: RegistrationService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
        const newUser: User = {
            name: this.registerForm.get('name')?.value,
            email: this.registerForm.get('email')?.value,
            password: this.registerForm.get('password')?.value
        };

        console.log('Data sent to backend:', newUser);

        this.registrationService.register(newUser).subscribe(
            (response) => {
                console.log('Registration successful', response);
                this.router.navigate(['/home']);
            },
            (error) => {
                console.error('Registration failed:', error);
                if (error.status === 409) {
                    alert('Cet email est déjà utilisé.');
                } else if (error.status === 400) {
                    alert('Veuillez vérifier les informations saisies.');
                } else {
                    alert('Une erreur est survenue. Veuillez réessayer plus tard.');
                }
            }
        );
    }
}

  togglePasswordVisibility(passwordFieldId: string) {
    const passwordField = document.getElementById(passwordFieldId) as HTMLInputElement;
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
  }
}


