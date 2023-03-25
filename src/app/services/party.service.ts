import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";
import { PartyDto } from "../models/partyDTO";

@Injectable({
    providedIn: 'root'
})
export class PartyService {
    parties!: PartyDto[];

    constructor(private http: HttpClient) {}

    getParties(): Observable<PartyDto[]> {
        return this.http.get<PartyDto[]>(`${environment.api}/Party`);
    }
}
