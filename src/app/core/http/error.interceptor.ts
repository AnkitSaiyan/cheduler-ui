import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private loaderSvc: LoaderService) {}
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        console.log(err);
        this.stopLoaders();
        return throwError(err);
      }),
    );
  }

  private stopLoaders() {
    this.loaderSvc.deactivate();
    this.loaderSvc.spinnerDeactivate();
  }
}

