import { inject } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services';


export const loaderInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: any) => {
    const loaderService = inject(LoaderService);
    loaderService.showLoader();

    return next(req).pipe(
        finalize(() => {
            loaderService.hideLoader();
        })
    );
};
