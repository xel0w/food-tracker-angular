import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-food-entries',
  templateUrl: './food-entries.component.html',
  styleUrls: ['./food-entries.component.css']
})
export class FoodEntriesComponent implements OnInit {
  foodEntries: any[] = [];
  id: string | null= null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      this.id = decodedToken.userId;
    } else {
      this.id = null;
    }
    this.getFoodEntries();
  }

  getFoodEntries() {
    const userid = this.id
    this.http.get<any[]>(`http://localhost:3000/api/food-entries/${userid}`).subscribe(
      response => {
        this.foodEntries = response;
      },
      error => {
        console.error(error);
      }
    );
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

}
