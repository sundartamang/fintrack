import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AnsuapiService } from '../../../shared/services';
import { Subscription } from 'rxjs';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { HighchartsChartModule } from 'highcharts-angular';
import { ANSU_FRONTED, BOOK_VALUE_PER_SHARE, EPS, HTTP_STATUS_OK, INTRINSIC_VALUE, MERO_LAGANI, NEPSE_ALPHA, PE, SHARE_SANSAR } from '../../../constants';
import * as Highcharts from 'highcharts';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-company-detail',
  imports: [CommonModule, RouterModule, TabsModule, TableModule, TooltipModule, HighchartsChartModule, SelectButtonModule, FormsModule],
  templateUrl: './company-detail.html',
  styleUrl: './company-detail.scss',
  standalone: true
})
export class CompanyDetail implements OnInit, OnDestroy {

  defaultYear: string = "Y";
  chartYears: any[] = [];

  details: any;
  valuation: any;
  quote: any[] = [];
  quoteMarket: any[] = [];
  quoteKeyRatio: any[] = [];
  relativeValuation: any[] = [];
  graphData: any[] = [];

  EPS = EPS;
  BOOK_VALUE_PER_SHARE = BOOK_VALUE_PER_SHARE;
  PE = PE;
  INTRINSIC_VALUE = INTRINSIC_VALUE;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;

  private shortCode!: string;
  private subscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private ansuApiService: AnsuapiService
  ) { }

  ngOnInit(): void {
    const shortCode = this.route.snapshot.paramMap.get('code')!;

    if (!shortCode) { return; }

    this.shortCode = shortCode;
    this.setChartYears();
    this.getDetails();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openTradingViewChart(): void {
    if (!this.shortCode) { return }
    const url = `${NEPSE_ALPHA}trading/chart?symbol=${this.shortCode}`;
    window.open(url, '_blank');
  }

  openNepseAlpha(): void {
    if (!this.shortCode) { return }
    const url = `${NEPSE_ALPHA}search?q=${this.shortCode}`;
    window.open(url, '_blank');
  }

  openMeroLagani(): void {
    if (!this.shortCode) { return }
    const url = `${MERO_LAGANI}CompanyDetail.aspx?symbol=${this.shortCode}`;
    window.open(url, '_blank');
  }

  openAnsu(): void {
    if (!this.shortCode) { return }
    const url = `${ANSU_FRONTED}company/${this.shortCode}`;
    window.open(url, '_blank');
  }

  openShareSansar(): void {
    if (!this.shortCode) { return }
    const url = `${SHARE_SANSAR}company/${this.shortCode}`;
    window.open(url, '_blank');
  }

  onDateChange(event: any): void {
    this.defaultYear = event;
    this.getGraphData();
  }

  getDetails(): void {
    this.subscription = this.ansuApiService.getCompanyDetail(this.shortCode).subscribe({
      next: (response) => {
        const { statusCode, data } = response;
        if (statusCode === HTTP_STATUS_OK && data) {
          this.details = data;

          this.getValuation();
          this.getQuota();
          this.getGraphData();
        }
      }, error: () => {
        this.details = null;
      }
    })
  }

  getRelativeValuation(): void {
    this.subscription = this.ansuApiService.getCompanyRelativeValuation(this.shortCode).subscribe({
      next: (response) => {
        const { statusCode, data } = response;
        if (statusCode === HTTP_STATUS_OK && data) {
          console.log("relative valuation => ", data)
          this.relativeValuation = data;
        }
      }, error: () => {
        this.relativeValuation = [];
      }
    })
  }

  private getValuation(): void {
    this.subscription = this.ansuApiService.getCompanyValuation(this.shortCode).subscribe({
      next: (response) => {
        const { statusCode, data } = response;
        if (statusCode === HTTP_STATUS_OK && data) {
          this.valuation = data;
        }
      }, error: () => {
        this.valuation = null;
      }
    })
  }

  private getQuota(): void {
    const payload = {
      "company_id": this.details.company_id,
      "quote_type_id": 1,
      "page": "1",
      "limit": "20",
      "sort": "ASC",
      "sort_field": "company_quote_id",
      "fields": [
        {
          "field": "string",
          "operator": "contains or matches",
          "value": "string"
        }
      ]
    }
    this.subscription = this.ansuApiService.getCompanyQuote(payload).subscribe({
      next: (response) => {
        const { statusCode, data } = response;
        if (statusCode === HTTP_STATUS_OK && data) {
          this.quote = data;

          this.quoteMarket = data.filter((item: any) => item.quote_type_id === 1);
          this.quoteKeyRatio = data.filter((item: any) => item.quote_type_id === 3);
        }

        this.setQuotaToValuation();
      }, error: () => {
        this.quote = [];
        this.quoteMarket = [];
        this.quoteKeyRatio = [];
      }
    })
  }

  private getGraphData(): void {
    const payload = {
      script: this.shortCode,
      type: this.defaultYear
    }

    this.subscription = this.ansuApiService.getCompanyGraphData(payload).subscribe({
      next: (response) => {
        const { statusCode, data } = response;
        if (statusCode === HTTP_STATUS_OK && data) {
          this.graphData = data;
          this.initializeChart(data);
        }
      }, error: () => {
        this.graphData = [];
      }
    })
  }

  private setQuotaToValuation(): void {
    const allowed = [
      "SIXTY_DAYS_AVERAGE",
      "MARKET_CAP",
      "ROA_TTM",
      "ROE_TTM",
      "BOOK_VALUE_PER_SHARE"
    ];

    for (let item of this.quote) {
      if (allowed.includes(item.code)) {
        this.valuation[item.code] = item.value;
      }
    }
  }

  private setChartYears(): void {
    this.chartYears = [
      { name: '5Y', value: '5Y' },
      { name: '1Y', value: 'Y' },
      { name: '6M', value: '6M' },
      { name: '3M', value: 'Q' },
      { name: '1M', value: 'M' },
      { name: '1W', value: 'W' },
    ]
  }

  private initializeChart(data: any): void {
    const chartColor = this.details?.indicator === 'increase' ? '#4ADE80' : '#FF7070';
    const defaultYear = this.defaultYear;

    const convertedData = data.map((d: any) => [
      d[0] * 1000,  // convert seconds → ms
      d[1]
    ]);

    this.chartOptions = {
      chart: {
        backgroundColor: '',
        style: { color: '' },
      },
      title: {
        text: '',
        align: 'left',
        style: { fontWeight: 'bold', fontSize: '14px' },
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: null
        },
        labels: {
          formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
            const dateValue = this.value as number;

            if (defaultYear === '5Y') {
              return Highcharts.dateFormat('%b %Y', dateValue);
            } else if (['Y', '6M'].includes(defaultYear)) {
              return Highcharts.dateFormat('%b', dateValue);
            } else {
              return Highcharts.dateFormat('%b %e', dateValue);
            }
          }
        }
      },
      plotOptions: {
        area: {
          marker: { radius: 2 },
          lineWidth: 1,
          states: { hover: { lineWidth: 1 } },
          threshold: null
        },
      },
      tooltip: {
        formatter: function (this: Highcharts.TooltipFormatterContextObject) {
          const ts = Number(this.x);
          const dateStr = Highcharts.dateFormat('%A, %B %e, %Y', ts);

          const valueStr = this.y != null ? this.y.toLocaleString() : 'N/A';

          return `
            <span style="font-size:10px; margin-bottom:3px">${dateStr}</span>
            <br/>
            <span tyle="font-size:12px">NPR. ${valueStr}</span>
          `;
        }
      },
      series: [
        {
          name: '',
          type: 'area',
          data: convertedData,
          color: chartColor
        }
      ],
      credits: { enabled: false },
      legend: { enabled: false },
    };
  }

}