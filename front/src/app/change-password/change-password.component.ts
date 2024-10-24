import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  passwordData = {
    oldPassword: '',
    newPassword: ''
  };

  constructor(private userService: UserService, private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.userService.changePassword(this.passwordData).subscribe(
      (response) => {
        console.log('Mot de passe changé avec succès:', response);
        alert('Mot de passe changé avec succès.');
        this.router.navigate(['/home-user']);
      },
      (error) => {
        console.error('Erreur lors du changement de mot de passe:', error);
        alert('Erreur lors du changement de mot de passe.');
      }
    );
  }
  
  passwordType = 'password'; // Déclarez la propriété passwordType


  togglePasswordType() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
    } else {
      this.passwordType = 'password';
    }
  }
}
