import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { CreateFibrePO } from '../models/createFibrePO';
import { PartywisePOCounts } from '../models/partywisePOCounts';
import { PendingPODetailsByParty } from '../models/pendingPODtsByParty';
import { FibreType } from '../models/fibreType';
import { ReceiveFibrePO } from '../models/receiveFibrePO';
import { FibreGraph } from '../models/fibreGraph';
import { FibreShade } from '../models/fibreShade';
import { FibreStock } from '../models/fibreStock';
import { FibreCategory } from '../models/fibreCategory';
import { FibreWasteCategory } from '../models/fibreWasteCategory';

@Injectable({
  providedIn: 'root',
})
export class FibreService {
  fibres!: FibreType[];

  constructor(private http: HttpClient) {}

  getFibreGraphData(): Observable<FibreGraph[]> {
    return this.http.get<FibreGraph[]>(
      `${environment.api}/Fiber/GetTwelveMonthSummary`
    );
  }

  getFibres(): Observable<FibreType[]> {
    return this.http.get<FibreType[]>(`${environment.api}/Fiber/GetFibreTypes`);
  }

  addFibre(fibreType: FibreType): Observable<any> {
    return this.http.post(`${environment.api}/Fiber/AddFibreType`, fibreType, {
      responseType: 'text',
    });
  }

  submitFibrePO(request: CreateFibrePO): Observable<string> {
    return this.http.post(`${environment.api}/Fiber/CreateFibrePO`, request, {
      responseType: 'text',
    });
  }

  getPONo(): Observable<string> {
    return this.http.get(`${environment.api}/Fiber/GetPONo`, {
      responseType: 'text',
    });
  }

  getPOByID(id: string): Observable<any> {
    return this.http.get<any>(`${environment.api}/Fiber/GetPOById?poId=${id}`);
  }

  getPartywiswPendingPO(): Observable<PartywisePOCounts[]> {
    return this.http.get<PartywisePOCounts[]>(
      `${environment.api}/Fiber/GetPartywiseOpenPOCounts`
    );
  }

  getPendingPOByParty(partyId: string): Observable<PendingPODetailsByParty[]> {
    return this.http.get<PendingPODetailsByParty[]>(
      `${environment.api}/Fiber/PendingPODetailsByParty?partyId=${partyId}`
    );
  }

  submitReceiveFibre(request: ReceiveFibrePO) {
    return this.http.post(`${environment.api}/Fiber/ReceiveFibre`, request, {
      responseType: 'text',
    });
  }

  getFibreShade(): Observable<FibreShade[]> {
    return this.http.get<FibreShade[]>(
      `${environment.api}/Fiber/GetActiveFibreShades`
    );
  }

  addFibreShade(shadeName: string): Observable<any> {
    return this.http.post(
      `${environment.api}/Fiber/AddFibreShade?fibreShadeName=${shadeName}`,
      {},
      {
        responseType: 'text',
      }
    );
  }

  getFibreStock(): Observable<FibreStock[]> {
    return this.http.get<FibreStock[]>(
      `${environment.api}/Fiber/GetFibreStock`
    );
  }

  getFibreStockForMixing(programId: string): Observable<FibreStock[]> {
    return this.http.get<FibreStock[]>(
      `${environment.api}/Fiber/GetFibreStockForMixing?programId=${programId}`
    );
  }

  getFibreCategories(): Observable<FibreCategory[]> {
    return this.http.get<FibreCategory[]>(
      `${environment.api}/Fiber/GetFibreCategories`
    );
  }

  getWasteCategory(): Observable<FibreWasteCategory[]> {
    return this.http.get<FibreWasteCategory[]>(
      `${environment.api}/Fiber/GetFibreWasteCategories`
    );
  }
}
