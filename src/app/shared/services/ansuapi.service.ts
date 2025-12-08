import { Injectable } from '@angular/core';
import { ANSU_BACKEND } from '../../constants';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AnsuapiService {

    BASE_URL = ANSU_BACKEND;

    constructor(private http: HttpClient) { }

    // valuations
    getAnsuValuation() {
        const url = `${this.BASE_URL}company/valuation`;
        return this.http.get<any>(url);
    }


    // Company details
    getCompanyDetail(shortcode: string) {
        const url = `${this.BASE_URL}company/company-details?short_code=${shortcode}`;
        return this.http.get<any>(url);
    }

    getCompanyQuote(payload: any) {
        const url = `${this.BASE_URL}company-quotes/list-company-quote`;
        return this.http.post<any>(url, payload);
    }

    getCompanyValuation(shortCode: string) {
        const url = `${this.BASE_URL}company/valuation-details?company_short_code=${shortCode}`;
        return this.http.get<any>(url);
    }

    getCompanyRelativeValuation(shortCode: string) {
        const url = `${this.BASE_URL}company/fiscal-year-relativepe?short_code=${shortCode}`;
        return this.http.get<any>(url);
    }
    
    getCompanyGraphData(payload: any) {
        const script = payload.script;
        const type = payload.type;
        const url = `${this.BASE_URL}company/graph?script=${script}&type=${type}`;
        return this.http.post<any>(url, {});
    }


}
