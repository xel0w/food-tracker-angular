import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { Chart, ChartOptions, DoughnutController, ArcElement, Title } from 'chart.js';

@Component({
  selector: 'app-daily-calories',
  templateUrl: './daily-calories.component.html',
  styleUrls: ['./daily-calories.component.css']
})
export class DailyCaloriesComponent implements OnInit {
  caloriesData: number[] = [];
  chart: any;
  id: string | null= null;
  totalCal: number | null = null;

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
    const userId = this.id;
    const currentDate = new Date(); // Obtenir la date actuelle
  
    this.http.get<any[]>(`http://localhost:3000/api/food-entries/${userId}`).subscribe(
      response => {
        // Filtrer les entrées pour ne récupérer que celles qui correspondent à la date actuelle
        const filteredEntries = response.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate.toDateString() === currentDate.toDateString(); // Comparaison des dates en ignorant l'heure
        });
  
        // Récupérer les calories des entrées filtrées
        this.caloriesData = filteredEntries.map(entry => entry.calories);
  
        // Calculer les calories totales
        const totalCalories = this.caloriesData.reduce((sum, calories) => sum + calories, 0);
  
        // Afficher les données sous forme de graphique
        this.showChart(totalCalories);
        this.totalCal = totalCalories;
      },
      error => {
        console.error(error);
      }
    );
  }
  
  

  showChart(totalCalories: number) {
    Chart.register(DoughnutController, ArcElement, Title); // Enregistrer le contrôleur DoughnutController et le plugin Title
    this.chart = new Chart('caloriesChart', {
      type: 'doughnut',
      data: {
        labels: ['Calories consommées', 'Calories restantes'],
        datasets: [
          {
            data: [totalCalories, 2000 - totalCalories], // 2000 est un exemple de limite quotidienne de calories
            backgroundColor: ['#FF6384', '#36A2EB'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB']
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Calories consommées aujourd\'hui'
          }
        }
      } as ChartOptions<'doughnut'>
    });
  }
}
