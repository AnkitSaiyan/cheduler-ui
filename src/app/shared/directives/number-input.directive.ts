import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { InputComponent } from 'diflexmo-angular-design';

@Directive({
  selector: '[dfmNumberInput]',
})
export class NumberInputDirective {
  @HostListener('input', ['$event'])
  private onChange(e: InputEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    this.handleChange();
  }

  @Input()
  public dfmNumberInput!: InputComponent;

  private numberOnly: RegExp = /^[0-9/.]+$/;

  constructor(private control: NgControl) {}

  private handleChange() {
    const inputText = this.dfmNumberInput.value?.toString();

    if (inputText?.length === 1 && inputText === '+') {
      return;
    }

    if (inputText && !inputText.match(this.numberOnly)) {
      this.dfmNumberInput.value = inputText.slice(0, -1);
      this.control.control?.setValue(this.dfmNumberInput.value);
    }
  }
}
