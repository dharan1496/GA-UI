import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { YarnShade } from '../models/yarnShade';
import { YarnCounts } from '../models/yarnCounts';
import { YarnBlend } from '../models/yarnBlend';
import { YarnBlendCreate } from '../models/yarnBlendCreate';
import { FibreWasteCategory } from '../models/fibreWasteCategory';
import { AppSharedService } from '../shared/app-shared.service';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(
    private http: HttpClient,
    private appSharedService: AppSharedService
  ) {}

  getYarnShade(): Observable<YarnShade[]> {
    return this.http.get<YarnShade[]>(
      `${environment.api}/Master/GetActiveYarnShades`
    );
  }

  addYarnShade(shadeName: string): Observable<any> {
    return this.http.post(
      `${environment.api}/Master/AddYarnShade?shadeName=${shadeName}`,
      {},
      {
        responseType: 'text',
      }
    );
  }

  getYarnCounts(): Observable<YarnCounts[]> {
    return this.http.get<YarnCounts[]>(
      `${environment.api}/Master/GetYarnCountsList`
    );
  }

  addYarnCounts(countsName: string): Observable<any> {
    return this.http.post(
      `${environment.api}/Master/AddYarnCounts?countsName=${countsName}`,
      {},
      {
        responseType: 'text',
      }
    );
  }

  deleteYarnCounts(countsId: number): Observable<string> {
    return this.http.post(
      `${environment.api}/Master/DeleteYarnCounts?countsId=${countsId}&deletedByUserId=${this.appSharedService.userId}`,
      {},
      {
        responseType: 'text',
      }
    );
  }

  getYarnBlend(): Observable<YarnBlend[]> {
    return this.http.get<YarnBlend[]>(
      `${environment.api}/Master/GetYarnBlendList`
    );
  }

  addYarnBlend(blend: YarnBlendCreate): Observable<any> {
    return this.http.post(`${environment.api}/Master/AddYarnBlend`, blend, {
      responseType: 'text',
    });
  }

  deleteYarnBlend(blendId: number): Observable<string> {
    return this.http.post(
      `${environment.api}/Master/DeleteYarnBlend?blendId=${blendId}&deletedByUserId=${this.appSharedService.userId}`,
      {},
      {
        responseType: 'text',
      }
    );
  }

  addWasteCategory(
    wasteCategoryName: string
  ): Observable<FibreWasteCategory[]> {
    return this.http.post<FibreWasteCategory[]>(
      `${environment.api}/Master/AddWasteCategory?wasteCategoryName=${wasteCategoryName}&createdByUserId=${this.appSharedService.userId}`,
      {}
    );
  }
}
