import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FibreTypeDto } from "src/app/models/fibreTypeDto";
import { environment } from "src/environment/environment";

@Injectable({
    providedIn: 'root'
})
export class FibreService {
    fibres!: FibreTypeDto[];

    constructor(private http: HttpClient) {}

    getFibres(): Observable<FibreTypeDto[]> {
        return this.http.get<FibreTypeDto[]>(`${environment.api}/Fibre`);
    }
}
