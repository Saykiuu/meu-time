import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class RequestService implements OnInit {

  httpOptions:any;

  constructor(
    private rq: HttpClient, 
    private rt: Router, 
    ){
    
  }
  ngOnInit(): void {
    
  }

  setAPIKey(){
    let temp = sessionStorage.getItem('apiKey')
    if(temp == null){
      this.rt.navigate(['/'])
    }
    this.httpOptions = {
      headers: new HttpHeaders({
        'x-rapidapi-key': temp!,
        "x-rapidapi-host": "v3.football.api-sports .io"
      })
    };
    
    console.log(this.httpOptions.headers.get("x-rapidapi-key"))

  }
  
  
  
  getPaises(): Observable<any>{
    return this.rq.get("https://v3.football.api-sports.io/countries", this.httpOptions);
  }

  getSessions(): Observable<any> {
    return this.rq.get("https://v3.football.api-sports.io/leagues/seasons", this.httpOptions);
  }
 
  getLigas(code: string, season: number | undefined = undefined): Observable<any> {
    let temp = `?code=${code}`;
    if(season != undefined){
      temp += `&season=${season}`
    }
    
    return this.rq.get("https://v3.football.api-sports.io/leagues" +temp, this.httpOptions);
  }

  getTeam(league: number, season: number | undefined = undefined): Observable<any>{
    let temp = `?league=${league}`;
    if (season != undefined) {
      temp += `&season=${season}`
    }
    
    return this.rq.get('https://v3.football.api-sports.io/teams' + temp, this.httpOptions);
  }

  getListPlayers(id_team: number, season: number): Observable<any>{
    let temp = `?team=${id_team}&season=${season}`
    return this.rq.get('https://v3.football.api-sports.io/players'+temp, this.httpOptions);
  }

  getStatistic(id_team: number, season: number, id_league: number): Observable<any>{
    let temp = `?team=${id_team}&season=${season}&league=${id_league}`
    return this.rq.get('https://v3.football.api-sports.io/teams/statistics' + temp, this.httpOptions);
  }
}
