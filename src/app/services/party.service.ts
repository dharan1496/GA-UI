import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Party } from '../models/party';

@Injectable({
  providedIn: 'root',
})
export class PartyService {
  parties!: Party[];

  constructor(private http: HttpClient) {}

  getParties(): Observable<Party[]> {
    return this.http.get<Party[]>(`${environment.api}/Party`);
  }
}
