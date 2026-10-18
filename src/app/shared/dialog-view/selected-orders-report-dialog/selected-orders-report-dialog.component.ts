import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ReportItem {
  productName: string;
  writerName?: string;
  publisherName: string;
  totalQuantity: number;
}

export interface GroupedReport {
  publisherName: string;
  items: ReportItem[];
  totalQuantity: number;
}

@Component({
  selector: 'app-selected-orders-report-dialog',
  templateUrl: './selected-orders-report-dialog.component.html',
  styleUrls: ['./selected-orders-report-dialog.component.scss']
})
export class SelectedOrdersReportDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { reportData: ReportItem[] },
    public dialogRef: MatDialogRef<SelectedOrdersReportDialogComponent>
  ) {}

  get groupedReportData(): GroupedReport[] {
    const map = new Map<string, ReportItem[]>();

    (this.data.reportData || []).forEach(item => {
      const pub = item.publisherName || 'N/A';
      if (!map.has(pub)) {
        map.set(pub, []);
      }
      map.get(pub)!.push(item);
    });

    const result: GroupedReport[] = [];

    map.forEach((items, publisherName) => {
      const totalQuantity = items.reduce((sum, i) => sum + i.totalQuantity, 0);
      result.push({ publisherName, items, totalQuantity });
    });

    result.sort((a, b) => a.publisherName.localeCompare(b.publisherName));
    return result;
  }

  printReport(): void {
    const printContent = document.getElementById('report-print-section');
    if (printContent) {
      const WindowPrt = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
      if (WindowPrt) {
        WindowPrt.document.write(`
          <html>
            <head>
              <title>Selected Orders Report</title>
              <style>
                body { font-family: 'Inter', Roboto, sans-serif; padding: 20px; color: #333; margin: 0; }
                h2 { text-align: center; color: #1a1a1a; margin-bottom: 5px; font-size: 24px; }
                .print-date { text-align: center; color: #666; font-size: 13px; margin-bottom: 25px;}
                .publisher-title { margin-top: 25px; margin-bottom: 8px; font-size: 16px; font-weight: 700; color: #1e293b; background: #e2e8f0; padding: 8px 12px; border-radius: 4px; display: flex; justify-content: space-between; }
                table { border-collapse: collapse; margin-top: 5px; margin-bottom: 15px; width: 100%; }
                table, th, td { border: 1px solid #cbd5e1; }
                th, td { padding: 8px 12px; text-align: left; }
                th { background-color: #f8fafc; font-weight: 600; color: #334155; font-size: 13px; text-transform: uppercase; }
                tr:nth-child(even) { background-color: #f8fafc; }
                .total-row { font-weight: bold; background-color: #f1f5f9 !important; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .sl-col { width: 40px; text-align: center; }
                .qty-col { width: 80px; text-align: center; }
                .writer-name { color: #555; font-size: 12px; }
                .grand-total-box { margin-top: 25px; text-align: right; font-size: 16px; font-weight: bold; padding: 12px 16px; background: #3b82f6; color: #ffffff; border-radius: 6px; }
                @media print {
                  .no-print { display: none; }
                  body { padding: 0; }
                  .publisher-group { page-break-inside: avoid; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        WindowPrt.document.close();
        WindowPrt.focus();
        setTimeout(() => {
          WindowPrt.print();
          WindowPrt.close();
        }, 300);
      }
    }
  }

  getTotalQuantity(): number {
    return (this.data.reportData || []).reduce((acc, curr) => acc + curr.totalQuantity, 0);
  }

  currentDateTime(): string {
    const d = new Date();
    return d.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
  }
}
