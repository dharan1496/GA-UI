import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class AppSharedService {
    logout = false;
    username = localStorage.getItem('username') || '';

    genUniqueId(): string {
        const dateStr = Date
          .now()
          .toString(36)
          .substring(5);
      
        const randomNum = Math
          .random()
          .toString(36)
          .substring(5);
        const id =  `${randomNum}${dateStr}`;
        localStorage.setItem('id', id);
        return id;
    }

    generatePONo(): string {
      const dateStr = Date
        .now()
        .toString(36)
        .substring(5);
    
      const randomNum = Math
        .random()
        .toString(36)
        .substring(2, 5);

      const year = new Date().getFullYear().toString().substring(2);
      return `${randomNum}${dateStr}/GA/${year}`;
  }
}
