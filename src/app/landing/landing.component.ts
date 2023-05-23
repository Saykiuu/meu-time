import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import {  ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  apikey: string = '';
  loading: boolean = false;
  constructor(
    private st: StorageService, 
    private ts: ToastrService, 
    private rq: HttpClient,
    private rt: Router, 
  ) { }

  ngOnInit(): void {
  }

  async logar(){

    if(this.apikey == ''){
      this.ts.warning('Campo vazio')

      return
    }
    this.loading = true
    let httpOptions = {
      headers: new HttpHeaders({
        "x-rapidapi-key": this.apikey,
        "x-rapidapi-host": "v3.football.api-sports .io"

      })
    };
    this.rq.get('https://v3.football.api-sports.io/status', httpOptions).subscribe((resp: any)=>{
      console.log(resp)
      if (resp.results != 0 && resp.response.subscription.active){
          // this.rt.navigate(['home']);
          this.ts.success('Acessado')
          this.st.setApiKey(this.apikey)
      }else{
        this.ts.warning('Conta inválida')

      }
      this.loading = false

    })
  }

}
