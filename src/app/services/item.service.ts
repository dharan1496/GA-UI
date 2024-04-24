import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSharedService } from '../shared/app-shared.service';
import { Department } from '../models/department';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(
    private http: HttpClient,
    private appSharedService: AppSharedService
  ) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(
      `${environment.api}/Item/GetDepartments`
    );
  }
}
