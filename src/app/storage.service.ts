
import { Injectable } from "@angular/core"

@Injectable({
    providedIn: 'root'
})

export class StorageService{
    private nome: string = '';
    private email: string = '';
    private apikey: string = '';
    
    getNome(){
        return this.nome;
    }
    setNome(val: string){
        this.nome = val;
    }
    getEmail() {
        return this.email;
    }
    setEmail(val: string) {
        this.email = val;
    }
    getApiKey() {
        return this.apikey;
    }
    setApiKey(val: string) {
        this.apikey = val;
    }



   
}

