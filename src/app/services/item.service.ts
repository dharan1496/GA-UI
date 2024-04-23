import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSharedService } from '../shared/app-shared.service';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(
    private http: HttpClient,
    private appSharedService: AppSharedService
  ) {}
}
