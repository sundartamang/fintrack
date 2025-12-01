import { Injectable } from '@angular/core';
import { ANSU_BASE_URL } from '../../constants';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AnsuapiService {

    BASE_URL = ANSU_BASE_URL;

    constructor(private http: HttpClient){}

    getAnsuValuation(){
        const url = `${this.BASE_URL}company/valuation`
        return this.http.get<any>(url);
    }
}
