import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AnsuapiService, LocalStorageService } from '../../shared/services';
import { Subscription } from 'rxjs';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Table } from 'primeng/table';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { COMPANY_VALUATIONS, HTTP_STATUS_OK, INTRINSIC_VALUE } from '../../constants';

export enum ValuationCategory {
  all = 'All',
  underValued = 'Under Valued',
  fairlyValued = 'Fairly Valued',
  overValued = 'Over Valued',
  highlyOverValued = 'Highly Overvalued',
}

const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

@Component({
  selector: 'app-valuation',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    SelectButtonModule,
    TooltipModule,
    DecimalPipe,
    ButtonModule,

    InputGroupModule,
    InputTextModule
  ],
  templateUrl: './valuation.html',
  styleUrl: './valuation.scss',
  standalone: true
})
export class Valuation implements OnInit, OnDestroy {

  allValuations: any[] = [];
  filteredValuations: any[] = [];

  undervaluedCompanies: any[] = [];
  fairlyValuedCompanies: any[] = [];
  overvaluedCompanies: any[] = [];
  highlyOvervaluedCompanies: any[] = [];

  valuationHeader!: any[];
  selectedValuationHeader: any = ValuationCategory.underValued;
  
  INTRINSIC_VALUE = INTRINSIC_VALUE;

  first = 0;
  rows = 20;
  @ViewChild(Table) table!: Table;
  isSmallScreen: boolean = false;

  private subscription!: Subscription;

  constructor(
    private ansuApiService: AnsuapiService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    const cachedValuations = this.localStorageService.getFromLocalStorageWithExpiry<any[]>(COMPANY_VALUATIONS);

    if (cachedValuations && cachedValuations.length > 0) {
      this.allValuations = cachedValuations;
      this.filteredValuations = [...this.allValuations];
      this.onValuationFilterChange(ValuationCategory.underValued);
      this.categorizeCompaniesByValuation();
    } else {
      this.getValuations();
    }

    this.setValuationHeader();
    this.setPagination();
    this.checkScreenSize();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getClassNameBaseValuationType(valuation: string): string {
    const valuationClassMap: Record<string, string> = {
      [ValuationCategory.underValued]: 'undervalued',
      [ValuationCategory.fairlyValued]: 'fairly-valued',
      [ValuationCategory.highlyOverValued]: 'highly-overvalued',
      [ValuationCategory.overValued]: 'overvalued'
    };

    return valuationClassMap[valuation] || '';
  }

  onValuationFilterChange(category: ValuationCategory) {
    if (category === ValuationCategory.all) {
      this.filteredValuations = this.allValuations;
    } else {
      this.filteredValuations = this.allValuations.filter(
        item => item.valuation === category
      );
    }

    // reset table config
    if (this.table) {
      this.table.clear();
    }

    this.setPagination();
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.filteredValuations ? this.first + this.rows >= this.filteredValuations.length : true;
  }

  isFirstPage(): boolean {
    return this.filteredValuations ? this.first === 0 : true;
  }

  redirectToCompanyDetailPage(company: any): void {
    const url = `/company/${company.company_sort_code}`;
    window.open(url, '_blank');
  }

  private getValuations(): void {
    this.subscription = this.ansuApiService.getAnsuValuation().subscribe({
      next: (response) => {
        const { statusCode, data } = response;
        if (statusCode === HTTP_STATUS_OK && Array.isArray(data) && data.length > 0) {

          const cleanedData = this.cleanAndSortValuationData(data);
          this.allValuations = cleanedData;
          this.localStorageService.saveToLocalStorageWithExpiry(COMPANY_VALUATIONS, cleanedData, THREE_DAYS);

          this.onValuationFilterChange(ValuationCategory.underValued)
          this.categorizeCompaniesByValuation();

        } else {
          this.allValuations = [];
          this.filteredValuations = this.allValuations;
        }
      },
      error: () => {
        this.allValuations = [];
        this.filteredValuations = this.allValuations;
      }
    })
  }

  private categorizeCompaniesByValuation(): void {
    if (this.allValuations.length === 0) return;

    this.resetValuationCategories();

    for (let company of this.allValuations) {

      switch (company.valuation) {
        case ValuationCategory.underValued:
          this.undervaluedCompanies.push(company);
          break;

        case ValuationCategory.fairlyValued:
          this.fairlyValuedCompanies.push(company);
          break;

        case ValuationCategory.overValued:
          this.overvaluedCompanies.push(company);
          break;

        case ValuationCategory.highlyOverValued:
          this.highlyOvervaluedCompanies.push(company);
          break;
      }
    }
  }

  private resetValuationCategories(): void {
    this.undervaluedCompanies = [];
    this.fairlyValuedCompanies = [];
    this.highlyOvervaluedCompanies = [];
    this.overvaluedCompanies = [];
  }

  private setValuationHeader(): void {
    this.valuationHeader = [
      { name: ValuationCategory.all, value: ValuationCategory.all },
      { name: ValuationCategory.underValued, value: ValuationCategory.underValued },
      { name: ValuationCategory.fairlyValued, value: ValuationCategory.fairlyValued },
      { name: ValuationCategory.overValued, value: ValuationCategory.overValued },
      { name: ValuationCategory.highlyOverValued, value: ValuationCategory.highlyOverValued },
    ]
  }

  private cleanAndSortValuationData(data: any[]): any[] {
    const cleaned = data.filter(company => company.company_name && company.company_name.trim() !== '');
    cleaned.sort((a, b) => a.company_name.localeCompare(b.company_name));

    return cleaned;
  }

  private setPagination() {
    if (this.selectedValuationHeader === ValuationCategory.all) {
      this.rows = 150;
    } else {
      this.rows = 20;
    }
  }

  private checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 768;
  }
}
