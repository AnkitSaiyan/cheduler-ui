import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'objectTOArray'
})
export class ObjectToArrayPipe implements PipeTransform {
  public transform(object: any): any[] {
    console.log(object)
    return Object.values(object).map((value) => value);
  }
}
