import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastType } from '../models';

const DEFAULT_TOAST_LIFE = 3000;

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  private messageService = inject(MessageService);

  public success(summary: string, detail: string, shouldStayUntilClosed: boolean = false): void {
    this.showToast('success', summary, detail, shouldStayUntilClosed);
  }

  public info(summary: string, detail: string, shouldStayUntilClosed: boolean = false): void {
    this.showToast('info', summary, detail, shouldStayUntilClosed);
  }

  public warn(summary: string, detail: string, shouldStayUntilClosed: boolean = false): void {
    this.showToast('warn', summary, detail, shouldStayUntilClosed);
  }

  public error(summary: string, detail: string, shouldStayUntilClosed: boolean = false): void {
    this.showToast('error', summary, detail, shouldStayUntilClosed);
  }

  private showToast(severity: ToastType, summary: string, detail: string, shouldStayUntilClosed: boolean): void {
    this.messageService.add({
      severity,
      summary,
      detail,
      life: shouldStayUntilClosed ? 0 : DEFAULT_TOAST_LIFE,
      sticky: shouldStayUntilClosed
    });
  }
}
