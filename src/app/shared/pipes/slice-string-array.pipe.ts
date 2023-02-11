import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'sliceStringArray'
})
export class SliceStringArrayPipe implements PipeTransform {
  public transform(arr: string[], end: number, start = 0, split = ''): string[] {
    if (split) {
      return arr.map((temp) => temp.split(split).map((t) => t.slice(start, end)).join(' - '));
    }
    return arr.map((a) => a.slice(start, end))
  }
}
