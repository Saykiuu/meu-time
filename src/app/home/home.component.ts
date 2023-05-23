import { Component, OnInit } from '@angular/core';
import { Paises } from '../paises';
import { Chart, registerables } from 'chart.js';
import { RequestService } from './request.service';
import { lastValueFrom } from 'rxjs';
import { Ligas } from '../ligas';
import { Times } from '../times';
import { Jogadores } from '../jogadores';
import {  Lineups, Results } from '../statistic';
import { ToastrService } from 'ngx-toastr';
Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loading = false;

  paisesFiltrados: Array<Paises> = [];
  paises: Array<Paises> = [];
  pais: Paises | undefined;

  seasonFiltrados: Array<number> = [];
  seasons: Array<number> = [];
  season: number | undefined;

  ligaFiltrados: Array<Ligas> = [];
  ligas: Array<Ligas> = [];
  liga: Ligas | undefined;

  timesFiltrados: Array<Times> = [];
  times: Array<Times> = [];
  time: Times | undefined;

  players: Array<Jogadores> = [];
  lineups: Array<Lineups> = [];
  results: Array<Results> = [];
  
  disabledLeague = true;
  disabledTeam = true;

  empty = true;
  
  public chart: any;

  constructor(private http: RequestService, private ts: ToastrService) { }
  


  ngOnInit(): void {
    

    

    this.getPaises();
    this.getSessions();
  }

  async getPaises(){
    this.paises = [];
    this.pais = undefined;
    try {
      this.loading = true;
      let con = await lastValueFrom(this.http.getPaises())
      if (con.results != 0) {
        con.response.forEach((e: any) =>{
          this.paises.push({
            code: e.code,
            name: e.name,
            flag: e.flag
          });
        });

      }else{
        this.ts.warning('Não existe dados');
      }
      this.loading = false;

    } catch (error) {
      this.loading = false;
      this.ts.error('erro na requisição')
    }
  }

  async getSessions() {
    this.seasons = [];
    this.season = undefined;
    try {
      this.loading = true;
      let con = await lastValueFrom(this.http.getSessions());
      if (con.results != 0) {
        con.response.forEach((e:any)=> {
          this.seasons.push(e);
        });
        this.seasons.reverse();
      }

      
      else{
        this.ts.warning('Não existe dados');
      }
      this.loading = false;
    } catch (error) {
      this.ts.error('erro na requisição')
      this.loading = false;
    }
  }

  async getLigas(){
    this.ligas = [];
    this.liga = undefined;
    try {
      this.loading = true;
      if (this.pais == undefined){
        this.ts.warning('Preencha os campos')
        return;
      }
      let con = await lastValueFrom(this.http.getLigas(this.pais.code, this.season));
      console.log(con)
      if (con.results != 0) {
        con.response.forEach((e:any) => {
            this.ligas.push({
              id: e.league.id,
              logo: e.league.logo,
              name: e.league.name,
              type: e.league.type
            })
        });
        
      }else{
        this.ts.warning('Não existe dados')
      }
      this.loading = false;
    } catch (error) {
      this.ts.error('erro na requisição')
      this.loading = false;
    }
  }

  async getTimes(){
    this.times = [];
    this.time = undefined;
    try {
      this.loading = true;
      if(this.liga == undefined){
        this.ts.warning('Preencha os campos')
        return
      }
      let con = await lastValueFrom(this.http.getTeam(this.liga.id, this.season));
      console.log(con)
      if (con.results != 0) {
        con.response.forEach((e:any) => {
          this.times.push({
            code: e.team.code,
            id: e.team.id,
            logo: e.team.logo,
            name: e.team.name
          });
        });
      }else{
        this.ts.warning('Não existe dados')
        
      }
      this.loading = false;
    } catch (error) {
      this.ts.error('erro na requisição')
      this.loading = false;

    }
  }

  async getlistPlayers(){
    this.players = [];
    try {
      if (this.time == undefined || this.season == undefined){
        this.ts.warning('Preencha os campos')
        return
      }
      let con = await lastValueFrom(this.http.getListPlayers(this.time.id, this.season));
      if(con.results != 0){
        con.response.forEach((e:any) => {
          this.players.push({
            idade: e.player.age,
            name: e.player.firstname+ ' ' + e.player.lastname,
            nationality: e.player.nationality,
            photo: e.player.photo
          }) 
        });
      }else{
        this.ts.warning('Não existe dados')
      }
    } catch (error) {
      this.ts.error('erro na requisição')
    }
  }

  async getStatistic(){
    this.results = [];
    this.lineups = [];

    
    try {
      if (this.time == undefined || this.liga == undefined || this.season ==undefined){
        this.ts.warning('Preencha os campos')
        return
      }
      let con = await lastValueFrom(this.http.getStatistic(this.time.id, this.season, this.liga.id));
      if (con.results != 0){
        let goals = con.response.goals.for.minute;
        let tempo = Object.keys(con.response.goals.for.minute)
        let valor = [];
        for (let i = 0; i < tempo.length; i++) {
          valor.push(goals[tempo[i]].total)
        }

        this.createChart(tempo, valor);

        let esc = con.response.lineups;
        esc.forEach((e:any) => {
          this.lineups.push({
            formation: e.formation,
            played: e.played
          })
        });

        let games = con.response.fixtures;
        this.results.push({
          played: games.played.total,
          wins: games.wins.total,
          draws: games.draws.total,
          loses: games.loses.total
        })
      }else{
        this.ts.warning('Não existe dados')
      }
    } catch (error) {
      this.ts.error('erro na requisição')
      console.log(error)
    }
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

  filtraSeasons (event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.seasons.length; i++) {
      let ses = this.seasons[i];
      if (ses.toString().indexOf(query) == 0) {
        filtered.push(ses);
      }
    }

    this.seasonFiltrados = filtered;

  }

  filtraTimes(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.times.length; i++) {
      let team = this.times[i];
      if (team.name.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) == 0) {
        filtered.push(team);
      }
    }

    this.timesFiltrados = filtered;

  }


  filtraLiga(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.ligas.length; i++) {
      let ligas = this.ligas[i];
      if (ligas.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(ligas);
      }
    }

    this.ligaFiltrados = filtered;

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

  onSelect(valor: string){
    switch(valor){
      case 'pais': 
        if(this.pais == undefined){
          this.liga = undefined;
          this.disabledLeague = true;
          this.time = undefined;
          this.disabledTeam = true;
        }else{
          this.liga = undefined;
          this.time = undefined;
          this.disabledLeague = false;
          this.disabledTeam = true;
          this.getLigas();
        }
      break
      case 'season':
        this.getTimes();
      break
      case 'liga':
        if (this.liga == undefined) {
          this.time = undefined;
          this.disabledTeam = true;
        }else{
          this.time = undefined;
          this.disabledTeam = false;
          this.getTimes();
        }
      break
      case 'time':
        this.getStatitics();
      break
    }
  
  }

  async getStatitics(){
    try {
      this.empty = false;
      this.loading = true;
      this.getlistPlayers()
      await this.getStatistic()
      this.loading = false;
    } catch (error) {
      this.loading = false;

    }
  }


  
}
