import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeSelectedItem',
})
export class RemoveSelectedItemPipe implements PipeTransform {
  public transform(value: any[], selectedValue: any[]): any {
    if (!selectedValue.length) return value;
    return value.filter((val) => !selectedValue.includes(val.originalValue));
  }
}






