import { Component, OnInit } from '@angular/core';
import { Paises } from '../paises';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  paisesFiltrados: Array<Paises> = [];
  paises: Array<Paises> = [];

  pais: Paises | undefined;
  public chart: any;

  constructor() { }
  


  ngOnInit(): void {
    this.paises.push({
        code: 'BR',
        flag: 'https://media.api-sports.io/flags/gb.svg',
        name: 'brasil'
      },
      {
        code: 'BR',
        flag: 'https://media.api-sports.io/flags/gb.svg',
        name: 'portugal'
      },
      {
        code: 'BR',
        flag: 'https://media.api-sports.io/flags/gb.svg',
        name: 'argentina'
      },
      {
        code: 'BR',
        flag: 'https://media.api-sports.io/flags/gb.svg',
        name: 'marrocos'
      },
      {
        code: 'BR',
        flag: 'https://media.api-sports.io/flags/gb.svg',
        name: 'italia'
      })
    this.pais = this.paises[0];

    this.createChart(['0 - 15'], [10])

  }
  filtraPaises(event: any){
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.paises.length; i++) {
      let paises = this.paises[i];
      if (paises.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(paises);
      }
    }

    this.paisesFiltrados = filtered;
    
  }

  createChart(labls: any[], valores: any[]) {
    const data = {
      labels: labls,
      datasets: [{
        label: 'Gols por tempo de jogo',
        data: valores,
        backgroundColor: [
          'rgba(255, 99, 132)',
          'rgba(255, 159, 64)',
          'rgba(255, 205, 86)',
          'rgba(75, 192, 192)',
          'rgba(54, 162, 235)',
          'rgba(153, 102, 255',
          'rgba(201, 203, 207 )'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1
      }]
    };
    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true

          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      },
    })
  }

  
}
