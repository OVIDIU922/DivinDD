import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.css']
})
export class CompleteProfileComponent implements OnInit {
  userId!: number;
  profileForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialisation du formulaire avec des validations appropriées
    this.profileForm = this.fb.group({  
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', Validators.required],
      birthdate: ['', Validators.required],
      gender: ['', Validators.required],
      profilePicture: [null],
    });
  }

  ngOnInit(): void {
    // Récupérer l'ID utilisateur depuis l'URL
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    // Si l'ID n'est pas valide, naviguer vers une page d'erreur ou l'accueil
    if (isNaN(this.userId) || this.userId <= 0) {
      alert('ID utilisateur invalide');
      this.router.navigate(['/home']);
      return;
    }
    // Récupérer les informations de l'utilisateur pour pré-remplir le formulaire
    this.userService.getUser(this.userId).subscribe((data) => {
      this.profileForm.patchValue(data);
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.profileForm.patchValue({ profilePicture: file });
      this.profileForm.get('profilePicture')?.updateValueAndValidity();
    }
  }
  
  onSubmit(): void {
    if (this.profileForm.valid) {
      // Activer temporairement le champ email pour l'inclure dans les données
      this.profileForm.get('email')?.enable();
  
      const updatedData = new FormData();
      Object.keys(this.profileForm.controls).forEach((key) => {
        const controlValue = this.profileForm.get(key)?.value;
        if (controlValue !== null) {
          updatedData.append(key, controlValue);
        }
      });
  
      // Vérification des données avant l'envoi
      updatedData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
  
      // Appel au service pour mettre à jour l'utilisateur
      this.userService.updateUser(this.userId, updatedData).subscribe({
        next: (response) => {
          alert('Profil complété avec succès');
          this.router.navigate(['/home-user']);
        },
        error: (error) => {
          console.error("Erreur lors de la mise à jour:", error);
          alert(`Erreur : ${error.message}`);
        },
        complete: () => {
          console.log('Mise à jour complète');
        }
      });
  
      // Désactiver à nouveau le champ email après la soumission
      this.profileForm.get('email')?.disable();
    } else {
      console.log("Formulaire invalide");
    }
  }    
}





/*import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.css']
})
export class CompleteProfileComponent implements OnInit {
  
  userId!: number;
  profileForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialisation du formulaire avec des validations appropriées
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', Validators.required],
      birthdate: ['', Validators.required],
      gender: ['', Validators.required],
      profilePicture: [null],
    });
  }

  
  ngOnInit(): void {
    // Récupérer l'ID utilisateur depuis l'URL
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    // Si l'ID n'est pas valide, naviguer vers une page d'erreur ou l'accueil
    if (isNaN(this.userId) || this.userId <= 0) {
      alert('ID utilisateur invalide');
      this.router.navigate(['/home']);
      return;
    }

    // Récupérer les informations de l'utilisateur pour pré-remplir le formulaire
    this.userService.getUser(this.userId).subscribe((data) => {
      this.profileForm.patchValue(data);
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.profileForm.patchValue({ profilePicture: file });
      this.profileForm.get('profilePicture')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.profileForm.get('email')?.enable();
      
      const updatedData = new FormData();
      Object.keys(this.profileForm.controls).forEach((key) => {
        const controlValue = this.profileForm.get(key)?.value;
        updatedData.append(key, controlValue);
      });
  
      // Affichez les données avant l'envoi
      updatedData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
  
      this.userService.updateUser(this.userId, updatedData).subscribe(
        (response) => {
          alert('Profil complété avec succès');
          this.router.navigate(['/home-user']);
        },
        (error) => {
          console.error("Erreur, votre profil n'est pas complété:", error);
        }
      );
  
      this.profileForm.get('email')?.disable();
    }
  }
    
}*/
