import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Party } from '../models/party';
import { State } from '../models/state';
import { District } from '../models/district';
import { City } from '../models/city';
import { PartyDepartment } from '../models/partyDepartment';
import { AppSharedService } from '../shared/app-shared.service';

@Injectable({
  providedIn: 'root',
})
export class PartyService {
  parties!: Party[];
  editPartyDetails: Party | undefined;

  constructor(
    private http: HttpClient,
    private appSharedService: AppSharedService
  ) {}

  getParties(): Observable<Party[]> {
    return this.http.get<Party[]>(`${environment.api}/Party/GetAllParties`);
  }

  getFibreParties(): Observable<Party[]> {
    return this.http.get<Party[]>(`${environment.api}/Party/GetFiberParties`);
  }

  getSalesParties(): Observable<Party[]> {
    return this.http.get<Party[]>(`${environment.api}/Party/GetSalesParties`);
  }

  getPartyById(id: number): Observable<Party> {
    return this.http.get<Party>(
      `${environment.api}/Party/GetPartyById?id=${id}`
    );
  }

  addParty(party: Party): Observable<string> {
    return this.http.post<string>(`${environment.api}/Party/AddParty`, party);
  }

  updateParty(party: Party): Observable<string> {
    return this.http.put(`${environment.api}/Party/UpdateParty`, party, {
      responseType: 'text',
    });
  }

  deleteParty(partyId: number): Observable<string> {
    return this.http.put(
      `${environment.api}/Party/DeleteParty`,
      {
        partyId,
        deletedByUserId: this.appSharedService.userId,
      },
      {
        responseType: 'text',
      }
    );
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

  getPartyDepartmentMaster(): Observable<PartyDepartment[]> {
    return this.http.get<PartyDepartment[]>(
      `${environment.api}/Party/GetPartyDepartmentMaster`
    );
  }

  addPartyDepartment(
    partyId: number,
    partyDepartments: PartyDepartment[]
  ): Observable<string> {
    return this.http.post<string>(
      `${environment.api}/Party/AddPartyDepartment?partyId=${partyId}`,
      partyDepartments
    );
  }
}
