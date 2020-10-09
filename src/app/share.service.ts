import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(private https:HttpClient) { }
  get1(){
    return this.https.get(' http://localhost:3000/posts');
  }
}
