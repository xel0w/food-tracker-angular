import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css']
})
export class ListeComponent {
  isAdmin: boolean | null= null;
  foodEntries: any[] = [];
  id: string | null= null;
  token: any;

  constructor(private router: Router, private http: HttpClient) {
    
  }
  ngOnInit() {
    const token = localStorage.getItem('token');
    this.token = token
    if (token) {
      const decodedToken: any = jwt_decode(token);
      this.isAdmin = decodedToken.isAdmin;
      this.id = decodedToken.userId;
    } else {
      this.isAdmin = null;
      this.id = null;
    }
    this.getFoodEntries();
  }
  deleteEntry(entryId: string) {
    this.http.delete(`http://localhost:3000/api/food-entries/${entryId}`).subscribe(
      () => {
        window.location.reload()
        this.getFoodEntries();
      },
      error => {
        console.error(error);
      }
    );
  }
  getFoodEntries() {
    this.http.get<any[]>(`http://localhost:3000/api/food-entries`).subscribe(
      response => {
        // Supprimer les doublons basés sur le nom de l'entrée
        const uniqueEntries = this.removeDuplicateEntries(response, 'nom');
  
        // Trier les entrées par ordre chronologique (du plus ancien au plus récent)
        const sortedEntries = this.sortEntriesByDate(uniqueEntries, 'date');
  
        this.foodEntries = sortedEntries;
      },
      error => {
        console.error(error);
      }
    );
  }
  
  removeDuplicateEntries(entries: any[], key: string): any[] {
    const uniqueEntries:any = [];
    const keys = new Set();
  
    entries.forEach(entry => {
      const value = entry[key];
      if (!keys.has(value)) {
        keys.add(value);
        uniqueEntries.push(entry);
      }
    });
  
    return uniqueEntries;
  }
  
  sortEntriesByDate(entries: any[], key: string): any[] {
    return entries.sort((a, b) => new Date(a[key]).getTime() - new Date(b[key]).getTime());
  }
  addToMyDay(entry: any) {

    const userId = this.id;
    const entryData = {
      nom: entry.nom,
      description: entry.description,
      calories: entry.calories,
      type: entry.type,
      id: userId,
      date: Date.now
    };
    console.log(entryData);
    
    this.http.post('http://localhost:3000/api/food', entryData)
      .subscribe(
        response => {
          console.log('Card ajoutée à la journée de l\'utilisateur:', entry);
          alert("Le plat a été ajouté à votre journée avec succés")
          
        },
        error => {
          console.error('Une erreur s\'est produite lors de l\'ajout de la card à la journée de l\'utilisateur:', error);
        }
      );
  }
}
