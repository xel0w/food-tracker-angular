import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-food-tracker',
  templateUrl: './food-tracker.component.html',
  styleUrls: ['./food-tracker.component.css']
})
export class FoodTrackerComponent {
  formulaire: FormGroup;
  id: string | null;
  currentDate: number;
  pseudo: string | null;

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder) { 
    this.formulaire = this.formBuilder.group({
      nom: '',
      description: '',
      calories: '',
      type: ''
    });

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      this.id = decodedToken.userId;
      this.pseudo = decodedToken.pseudo;
    } else {
      this.id = null;
      this.pseudo = null;
    }
    this.currentDate = Date.now(); // Obtenir la date actuelle
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/']);
    }
  }

  saveFoodEntry() {
    const { nom, description, calories, type } = this.formulaire.value;
    const id = this.id;
    const pseudo = this.pseudo
    const date = this.currentDate; // Utiliser la date actuelle

    // Envoyer les données au backend
    this.http.post('http://localhost:3000/api/food', { nom, description, calories, type, id, date, pseudo }).subscribe(
      response => {
        window.location.reload()
        this.router.navigate(['food-tracker']);
      },
      error => {
        console.error(error);
      }
    );
  }
}
