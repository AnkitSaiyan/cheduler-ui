import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'as',
})
export class AsPipe implements PipeTransform {
  transform(value: any, args?: string): any {
    switch (args) {
      case 'string':
        return value.toString();
      case 'number':
        return Number(value);
      case 'boolean':
        return Boolean(value);
      default:
        return value as any;
    }
  }
}

