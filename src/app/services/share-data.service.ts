import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DUTCH_BE } from 'src/app/shared/utils/const';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
  private language$$ = new BehaviorSubject<string>(DUTCH_BE);

  constructor(private http: HttpClient) {
    if (localStorage.getItem('lang')) {
      this.language$$.next(localStorage.getItem('lang') ?? '');
    }
  }

  public setLanguage(languge: string) {
    localStorage.setItem('lang', languge);
    this.language$$.next(languge);
  }

  public getLanguage$(): Observable<string> {
    return this.language$$.asObservable();
  }

}
