import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AppSharedService {
  logout = false;
  username = localStorage.getItem('username') || '';

  genUniqueId(): string {
    const dateStr = Date.now().toString(36).substring(5);

    const randomNum = Math.random().toString(36).substring(5);
    const id = `${randomNum}${dateStr}`;
    localStorage.setItem('id', id);
    return id;
  }

  generatePONo(): string {
    const randomNum = Math.random().toString(36).substring(2, 5);

    const year = new Date().getFullYear().toString().substring(2);
    return `${randomNum}/GA/${year}`;
  }

  restrictDecimalZero(event: any) {
    const value = event.target.value;
    if (value && value.includes('.')) {
      event.target.value = value.substr(0, value.indexOf('.'));
    }
  }

  formatDate(e: any, dateControl: AbstractControl) {
    const enteredDate = e.target.value;
    if (enteredDate && dateControl) {
      const date = new Date(e.target.value);
      date.setHours(date.getHours() + 5);
      date.setMinutes(date.getMinutes() + 30);
      dateControl?.setValue(date, { onlyself: true });
    }
  }
}
