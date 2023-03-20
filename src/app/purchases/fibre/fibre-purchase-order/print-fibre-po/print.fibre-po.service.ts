import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PrintFibrePOService {
    print = false;
    fibrePOData: any;
}