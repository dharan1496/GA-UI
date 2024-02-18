import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { ConversionProgram } from '../models/conversionProgram';
import { ProgramForMixing } from '../models/programForMixing';
import { FibreMixing } from '../models/fibreMixing';
import { ProgramForProductionEntry } from '../models/programForProductionEntry';
import { ProductionEntry } from '../models/productionEntry';
import { ProgramWaste } from '../models/programWaste';
import { YarnRecoverySummary } from '../models/yarnRecoverySummary';
import { ProgramWasteStock } from '../models/programWasteStock';
import { ConversionProgramStatus } from '../models/conversionProgramStatus';
import { FibreIssued } from '../models/fibreIssued';
import { ProductionYarn } from '../models/productionYarn';
import { ProgramFibresMixed } from '../models/programFibresMixed';

@Injectable({
  providedIn: 'root',
})
export class ConversionService {
  constructor(private http: HttpClient) {}

  createProgram(program: ConversionProgram): Observable<any> {
    return this.http.post(
      `${environment.api}/Conversion/CreateConversionProgram`,
      program,
      {
        responseType: 'text',
      }
    );
  }

  updateProgram(program: ConversionProgram): Observable<any> {
    return this.http.post(
      `${environment.api}/Conversion/UpdateConversionProgram`,
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

  getProgramMixingDetails(programId: number): Observable<ProgramFibresMixed[]> {
    return this.http.get<ProgramFibresMixed[]>(
      `${environment.api}/Conversion/GetProgramMixingDetails?programId=${programId}`
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

  updateMixingDetails(
    mixingId: number,
    fibreIssued: FibreIssued[]
  ): Observable<any> {
    return this.http.post(
      `${environment.api}/Conversion/UpdateMixingDetails?mixingId=${mixingId}&updatedByUserId=0`,
      fibreIssued,
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

  updateProduction(
    productionId: number,
    entry: ProductionYarn[]
  ): Observable<any> {
    return this.http.post(
      `${environment.api}/Conversion/UpdateProduction?productionId=${productionId}&updatedByUserId=0`,
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

  getProductionWasteStock(fields: any): Observable<ProgramWasteStock[]> {
    const { fromDate, toDate, blendId, shadeId } = fields;
    return this.http.get<ProgramWasteStock[]>(
      `${environment.api}/Conversion/GetProductionWasteStock?wasteEntryFromDate=${fromDate}&wasteEntryToDate=${toDate}&shadeId=${shadeId}&blendId=${blendId}`
    );
  }

  getConversionProgramStatus(
    blendId: number,
    shadeId: number,
    countsId: number
  ): Observable<ConversionProgramStatus[]> {
    return this.http.get<ConversionProgramStatus[]>(
      `${environment.api}/Conversion/GetConversionProgramStatus?shadeId=${shadeId}&blendId=${blendId}&countsId=${countsId}`
    );
  }

  getConversionProgramsByShade(
    shadeId: number,
    fromDate: string,
    toDate: string
  ): Observable<ConversionProgram[]> {
    return this.http.get<ConversionProgram[]>(
      `${environment.api}/Conversion/GetConversionProgramsByShade?shadeId=${shadeId}&fromDate=${fromDate}&toDate=${toDate}`
    );
  }

  getProductionDetails(
    fromDate: string,
    toDate: string,
    lot: string,
    shadeId: number,
    blendId: number
  ): Observable<ProductionEntry[]> {
    let endpoint = `/Conversion/GetProductionDetails?productionFromDate=${fromDate}&productionToDate=${toDate}&lot=${lot}`;
    shadeId && (endpoint = endpoint + `&shadeId=${shadeId}`);
    blendId && (endpoint = endpoint + `&blendId=${blendId}`);
    return this.http.post<ProductionEntry[]>(
      `${environment.api}${endpoint}`,
      {}
    );
  }
}
