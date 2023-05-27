import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environment/environment';
import { YarnShade } from '../models/yarnShade';
import { YarnCounts } from '../models/yarnCounts';
import { YarnBlend } from '../models/yarnBlend';
import { YarnBlendCreate } from '../models/yarnBlendCreate';
import { ConversionProgram } from '../models/conversionProgram';
import { ProgramForMixing } from '../models/programForMixing';
import { FibreMixing } from '../models/fibreMixing';
import { ProgramForProductionEntry } from '../models/programForProductionEntry';
import { ProductionEntry } from '../models/productionEntry';
import { ProgramWaste } from '../models/programWaste';
import { YarnRecoverySummary } from '../models/yarnRecoverySummary';

@Injectable({
  providedIn: 'root',
})
export class YarnService {
  constructor(private http: HttpClient) {}

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

  createProgram(program: ConversionProgram): Observable<any> {
    return this.http.post(
      `${environment.api}/Conversion/CreateConversionProgram`,
      program,
      {
        responseType: 'text',
      }
    );
  }

  getProgramsForMixing(): Observable<ProgramForMixing[]> {
    return this.http.get<ProgramForMixing[]>(
      `${environment.api}/Conversion/GetProgramsForMixing`
    );
  }

  getProgramDetailsById(programId: number): Observable<ConversionProgram> {
    return this.http.get<ConversionProgram>(
      `${environment.api}/Conversion/GetProgramDetailsById?programId=${programId}`
    );
  }

  issueFibreForMixing(fibreMixing: FibreMixing): Observable<any> {
    return this.http.post(
      `${environment.api}/Conversion/IssueFibreForMixing`,
      fibreMixing,
      {
        responseType: 'text',
      }
    );
  }

  getProgramsForProductionEntry(): Observable<ProgramForProductionEntry[]> {
    return this.http.get<ProgramForProductionEntry[]>(
      `${environment.api}/Conversion/GetProgramsForProductionEntry`
    );
  }

  conversionProduction(entry: ProductionEntry): Observable<any> {
    return this.http.post(
      `${environment.api}/Conversion/ConversionProduction`,
      entry,
      {
        responseType: 'text',
      }
    );
  }

  conversionWaste(
    wasteEntry: ProgramWaste[],
    programId: number
  ): Observable<any> {
    return this.http.post(
      `${environment.api}/Conversion/ConversionWaste?programId=${programId}&createdByUserId=0`,
      wasteEntry,
      {
        responseType: 'text',
      }
    );
  }

  getProgramWasteById(programId: number): Observable<ProgramWaste[]> {
    return this.http.get<ProgramWaste[]>(
      `${environment.api}/Conversion/GetProgramWasteById?programId=${programId}`
    );
  }

  getYarnRecoverySummary(): Observable<YarnRecoverySummary[]> {
    return this.http.get<YarnRecoverySummary[]>(
      `${environment.api}/Conversion/GetYarnRecoverySummary`
    );
  }

  getYarnOrderNo(): Observable<string> {
    return of('1/YPO/GA/23');
    // return this.http.get(`${environment.api}/Fiber/`, {
    //   responseType: 'text',
    // });
  }
}
