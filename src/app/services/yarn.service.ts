import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { YarnOrder } from '../models/yarnOrder';
import { OrdersPendingDelivery } from '../models/ordersPendingDelivery';
import { YarnStockByOrderId } from '../models/yarnStockByOrderId';
import { YarnDelivery } from '../models/yarnDelivery';
import { YarnDC } from '../models/yarnDC';
import { YarnDeliverySummary } from '../models/yarnDeliverySummary';
import { OrdersPendingInvoice } from '../models/ordersPendingInvoice';
import { DCsPendingInvoice } from '../models/dcsPendingInvoice';
import { YarnInvoice } from '../models/yarnInvoice';
import { CreateYarnInvoice } from '../models/createYarnInvoice';
import { YarnReturn } from '../models/yarnReturn';
import { YarnDeliverySearchResult } from '../models/yarnDeliverySearchResult';
import { YarnStock } from '../models/yarnStock';
import { AppSharedService } from '../shared/app-shared.service';

@Injectable({
  providedIn: 'root',
})
export class YarnService {
  constructor(
    private http: HttpClient,
    private appSharedService: AppSharedService
  ) {}

  receiveYarnOrder(order: YarnOrder): Observable<any> {
    return this.http.post(
      `${environment.api}/YarnOrder/ReceiveYarnOrder`,
      order,
      {
        responseType: 'text',
      }
    );
  }

  getYarnOrderDetailsById(id: string): Observable<YarnOrder> {
    return this.http.get<YarnOrder>(
      `${environment.api}/YarnOrder/GetYarnOrderDetailsById?orderId=${id}`
    );
  }

  getYarnOrderListByParty(id: string): Observable<YarnOrder[]> {
    return this.http.get<YarnOrder[]>(
      `${environment.api}/YarnOrder/GetYarnOrderListByParty?partyId=${id}`
    );
  }

  getYarnOrderListByDate(
    fromDate: string,
    toDate: string
  ): Observable<YarnOrder[]> {
    return this.http.get<YarnOrder[]>(
      `${environment.api}/YarnOrder/GetYarnOrderListByDate?fromDate=${fromDate}&toDate=${toDate}`
    );
  }

  closeYarnOrder(order: any): Observable<string> {
    return this.http.put(`${environment.api}/YarnOrder/CloseYarnOrder`, order, {
      responseType: 'text',
    });
  }

  reopenYarnOrder(order: any): Observable<string> {
    return this.http.put(
      `${environment.api}/YarnOrder/ReOpenYarnOrder`,
      order,
      {
        responseType: 'text',
      }
    );
  }

  updateYarnOrder(order: YarnOrder): Observable<any> {
    return this.http.put(
      `${environment.api}/YarnOrder/UpdateYarnOrder`,
      order,
      {
        responseType: 'text',
      }
    );
  }

  getOrdersPendingDelivery(id: string): Observable<OrdersPendingDelivery[]> {
    return this.http.get<OrdersPendingDelivery[]>(
      `${environment.api}/YarnOrder/GetOrdersPendingDelivery?partyId=${id}`
    );
  }

  getYarnStockByOrderId(id: string): Observable<YarnStockByOrderId[]> {
    return this.http.get<YarnStockByOrderId[]>(
      `${environment.api}/YarnOrder/GetYarnStockByOrderId?orderId=${id}`
    );
  }

  createYarnDelivery(order: YarnDelivery): Observable<YarnDC> {
    return this.http.post<YarnDC>(
      `${environment.api}/YarnOrder/CreateYarnDelivery`,
      order
    );
  }

  getYarnDeliveriesByOrderId(id: string): Observable<YarnDeliverySummary[]> {
    return this.http.get<YarnDeliverySummary[]>(
      `${environment.api}/YarnOrder/GetYarnDeliveriesByOrderId?orderId=${id}`
    );
  }

  getYarnDeliveries(
    partyId: string,
    fromDate: string,
    toDate: string
  ): Observable<YarnDeliverySummary[]> {
    return this.http.get<YarnDeliverySummary[]>(
      `${environment.api}/YarnOrder/GetYarnDeliveries?fromDate=${fromDate}&toDate=${toDate}&partyId=${partyId}`
    );
  }

  getYarnDCDetailsById(id: string): Observable<YarnDC> {
    return this.http.get<YarnDC>(
      `${environment.api}/YarnOrder/GetYarnDCDetailsById?dcId=${id}`
    );
  }

  ordersPendingInvoiceByPartyId(
    id: string
  ): Observable<OrdersPendingInvoice[]> {
    return this.http.get<OrdersPendingInvoice[]>(
      `${environment.api}/YarnOrder/OrdersPendingInvoiceByPartyId?partyId=${id}`
    );
  }

  ordersPendingInvoiceByOrderId(id: number): Observable<DCsPendingInvoice[]> {
    return this.http.get<DCsPendingInvoice[]>(
      `${environment.api}/YarnOrder/DCsPendingInvoiceByOrderId?orderId=${id}`
    );
  }

  createYarnOrderInvoice(order: CreateYarnInvoice): Observable<YarnInvoice> {
    return this.http.post<YarnInvoice>(
      `${environment.api}/YarnOrder/CreateYarnOrderInvoice`,
      order
    );
  }

  receiveYarnReturn(yarnReturn: YarnReturn): Observable<any> {
    return this.http.post<any>(
      `${environment.api}/YarnOrder/ReceiveYarnReturn?createdUserId=${this.appSharedService.userId}`,
      yarnReturn
    );
  }

  searchYarnDeliveries(fields: any): Observable<YarnDeliverySearchResult[]> {
    let endpoint = '';
    const { partyId, countsId, blendId, shadeId } = fields;
    partyId && (endpoint = endpoint + `partyId=${partyId}`);
    countsId && (endpoint = endpoint + `&countsId=${countsId}`);
    blendId && (endpoint = endpoint + `&blendId=${blendId}`);
    shadeId && (endpoint = endpoint + `&shadeId=${shadeId}`);
    return this.http.get<YarnDeliverySearchResult[]>(
      `${environment.api}/YarnOrder/SearchYarnDeliveries?${endpoint}`
    );
  }

  GetYarnCurrentStock(): Observable<YarnStock[]> {
    return this.http.get<YarnStock[]>(
      `${environment.api}/YarnOrder/GetYarnCurrentStock`
    );
  }

  UpdateEInvoiceNo(invoiceNo: number, invoiceId: number): Observable<boolean> {
    return this.http.put<boolean>(
      `${environment.api}/YarnOrder/UpdateEInvoiceNo?eInvoiceNo=${invoiceNo}&invoiceId=${invoiceId}`,
      {}
    );
  }
}
