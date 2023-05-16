/* eslint-disable @angular-eslint/directive-selector */
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
  selector: '[decimal]',
  standalone: true,
})
export class DecimalDirective {
  @Input() decimal!: string;
  private specialKeys: Array<string> = [
    'Backspace',
    'Tab',
    'End',
    'Home',
    '-',
    'ArrowLeft',
    'ArrowRight',
    'Del',
    'Delete',
  ];

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    if (
      current &&
      !String(current).match(
        new RegExp(`^\\d*\\.?\\d{0,${+this.decimal - 1}}$`)
      )
    ) {
      event.preventDefault();
    }
  }
}
