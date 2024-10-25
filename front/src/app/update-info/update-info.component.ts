import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-info',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-info.component.html',
  styleUrls: ['./update-info.component.css']
})
export class UpdateInfoComponent {
  user = { 
    name: '', 
    email: '', 
    phone: '', 
    address: '', 
    birthdate: '', 
    gender: '' 
  };

  selectedFile: File | null = null;
  errorMessage: string = '';

  constructor(private userService: UserService,  private router: Router) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.user.name);
    formData.append('email', this.user.email);
    formData.append('phone', this.user.phone);
    formData.append('address', this.user.address);
    formData.append('birthdate', this.user.birthdate);
    formData.append('gender', this.user.gender);

    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
    }

    this.userService.updateUserInfo(formData).subscribe(
      (response) => {
        alert('Informations mises à jour avec succès');
        this.router.navigate(['/home-user']);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour des informations', error);
        this.errorMessage = 'Une erreur est survenue lors de la mise à jour des informations.';
      }
    );
  }
}




/*import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Ajoutez cette ligne
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-update-info',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-info.component.html',
  styleUrls: ['./update-info.component.css']
})
export class UpdateInfoComponent {

  user = { 
    name: '', 
    email: '', 
    phone: '', 
    address: '', 
    birthdate: '', 
    gender: '', 
    profilePicture: '' 
  };

  selectedFile: File | null = null;

  constructor(private userService: UserService,  private router: Router) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.user.name);
    formData.append('email', this.user.email);
    formData.append('phone', this.user.phone);
    formData.append('address', this.user.address);
    formData.append('birthdate', this.user.birthdate);
    formData.append('gender', this.user.gender);

    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
    }

    this.userService.updateUserInfo(formData).subscribe(
      (response) => {
        alert('Informations personnelles mises à jour avec succès');
        this.router.navigate(['/home-user']);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour des informations', error);
        alert('Erreur lors de la mise à jour des informations');
      }
    );
  }

}*/
