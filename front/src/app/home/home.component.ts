import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


 
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  constructor(private router: Router) {}

  // Redirection vers la page Boutique
  goToBoutique() {
    this.router.navigate(['/boutique']);
  }

  // Redirection vers la page Promo
  goToPromo() {
    this.router.navigate(['/promo']);
  }
  hoveredItem: string = '';

  showDetails(item: string) {
    this.hoveredItem = item;
  }


}
