import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { NotificationDataService } from '../services/notification-data.service';
import { HttpStatusCodes } from 'src/app/shared/models/base-response.model';
import { Translate } from 'src/app/shared/models/translate.model';
import { ENG_BE } from 'src/app/shared/utils/const';
import { NotificationType } from 'diflexmo-angular-design';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationSvc: NotificationDataService, private loaderSvc: LoaderService,) {
  }
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(
			catchError((err) => {
				// lang hardcoded to english for now
        console.log('efwefwe');
        
				this.generateErrorMessage(err, localStorage.getItem('lang') || ENG_BE);
				this.stopLoaders();

				return throwError(err);
			}),
		);
	}

  private generateErrorMessage(err: any, lang: string) {
    let errorMessage = Translate.Error.SomethingWrong[lang];

    if (err.status) {
      switch (err.status) {
        case HttpStatusCodes.FORBIDDEN: {
          errorMessage = Translate.Error.Forbidden[lang];
        }
        break;
        case HttpStatusCodes.UNAUTHORIZED: {
          errorMessage = Translate.Error.Unauthorized[lang];
        }
        break;
        default: {
          if (err?.error?.errors) {
            const errObj = err.error.errors;
            if (errObj?.GeneralErrors) {
              if (Array.isArray(errObj.GeneralErrors)) {
                errorMessage = '';
                errObj.GeneralErrors.forEach((msg) => {
                  errorMessage += `${msg} `;
                });
              } else if (typeof errObj?.GeneralErrors === 'string') {
                errorMessage = errObj.GeneralErrors
              }
            } else if (typeof errObj === 'string') {
              errorMessage = errObj;
            }

          } else if (err?.error?.message && typeof err.error.message === 'string') {
            errorMessage = Translate.Error.BackendCodes[lang][err.error.message] || Translate.Error.SomethingWrong[lang];
          } else if (err?.message && typeof err?.message === 'string') {
            errorMessage = Translate.Error.BackendCodes[lang][err.error.message] || Translate.Error.SomethingWrong[lang];
          }
        }
      }
    }

    this.notificationSvc.showNotification(errorMessage, NotificationType.DANGER);
  }

  private stopLoaders() {
    this.loaderSvc.deactivate();
    this.loaderSvc.spinnerDeactivate();
  }
}
