import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
    private _loading$ = new BehaviorSubject<boolean>(false);
    public readonly loading$: Observable<boolean> = this._loading$.asObservable();

    showLoader() { this._loading$.next(true); }
    hideLoader() { this._loading$.next(false); }
}
