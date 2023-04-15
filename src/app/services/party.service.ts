import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Party } from '../models/party';
import { State } from '../models/state';
import { District } from '../models/district';
import { City } from '../models/city';

@Injectable({
  providedIn: 'root',
})
export class PartyService {
  parties!: Party[];
  editPartyDetails: Party | undefined;

  constructor(private http: HttpClient) {}

  getParties(): Observable<Party[]> {
    return this.http.get<Party[]>(`${environment.api}/Party/GetAllParties`);
  }

  addParty(party: Party): Observable<string> {
    return this.http.post(`${environment.api}/Party/AddParty`, party, {
      responseType: 'text',
    });
  }

  deleteParty(partyId: number): Observable<boolean> {
    return this.http.put<boolean>(`${environment.api}/Party/DeleteParty`, {
      partyId,
      deletedByUserId: 0,
    });
  }

  getStates(): Observable<State[]> {
    return this.http.get<State[]>(`${environment.api}/Party/GetStates`);
  }

  getDistricts(): Observable<District[]> {
    return this.http.get<District[]>(
      `${environment.api}/Party/GetAllDistricts`
    );
  }

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(`${environment.api}/Party/GetAllCities`);
  }
}
