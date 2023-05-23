import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paises } from '../paises';
import { StorageService } from '../storage.service';
@Injectable({
  providedIn: 'root'
})
export class RequestService {

  

  constructor(private rq: HttpClient){}
  
  httpOptions = {
    headers: new HttpHeaders({
      "x-rapidapi-key": "a1ed97c9259e7583336e37ad90fd6005",
      "x-rapidapi-host": "v3.football.api-sports .io"
      
    })
  };
  
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
    let temp = `?team=${id_team}&?season=${season}`
    return this.rq.get('https://v3.football.api-sports.io/players'+temp, this.httpOptions);
  }

  getStatistic(id_team: number, season: number, id_league: number): Observable<any>{
    let temp = `?team=${id_team}&?season=${season}&?league=${id_league}`
    return this.rq.get('https://v3.football.api-sports.io/teams/statistics' + temp, this.httpOptions);
  }
}
