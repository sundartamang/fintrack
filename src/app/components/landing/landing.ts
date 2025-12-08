import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NEPAL_STOCK_EXCHANGE, NEPSE_ALPHA } from '../../constants';

@Component({
  selector: 'app-landing',
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  standalone: true,
})
export class Landing implements OnInit {

  nepalStockExchange: string = NEPAL_STOCK_EXCHANGE;
  nepseAlphaAdvanceChart: string = `${NEPSE_ALPHA}nepse-chart`;

  constructor() { }

  ngOnInit(): void {
  }

}
