import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { OrderService } from '../../../services/common/order.service';
import { UiService } from '../../../services/core/ui.service';
import { UtilsService } from '../../../services/core/utils.service';
import { OrderStatus } from '../../../enum/order.enum';

@Component({
  selector: 'app-moderator-activity',
  templateUrl: './moderator-activity.component.html',
  styleUrls: ['./moderator-activity.component.scss'],
})
export class ModeratorActivityComponent implements OnInit, OnDestroy {
  // Filters
  selectedAdminId: string = 'all';
  dateShortcut: string = 'thisMonth';
  startDate: Date | null = new Date();
  endDate: Date | null = new Date();
  selectedAction: string = 'all';
  searchQuery: string = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 25;
  totalLogs: number = 0;

  // Data
  isLoading: boolean = false;
  allAdmins: any[] = [];
  // Delivery & Status Stats
  topModerator: any = null;
  deliveryLeaderboard: any[] = [];
  statusSummary: any = {
    totalOrders: 0,
    totalAmount: 0,
    pending: 0,
    confirm: 0,
    processing: 0,
    sentToCourier: 0,
    shipping: 0,
    delivered: 0,
    cancel: 0,
    refund: 0,
    draft: 0,
  };

  // Chart configuration
  activeChartMetric: 'revenue' | 'orders' | 'activity' = 'revenue';
  chartType: ChartType = 'bar';
  chartLegend: boolean = true;
  chartLabels: Label[] = [];
  chartData: ChartDataSets[] = [
    {
      data: [],
      label: 'সফল ডেলিভার্ড টাকা (BDT)',
      backgroundColor: '#10b981',
    },
  ];
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'top',
      labels: {
        fontColor: '#334155',
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
      },
    },
    scales: {
      xAxes: [
        {
          gridLines: { display: false },
          ticks: { fontColor: '#4a5568', fontStyle: '600' },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontColor: '#718096',
            callback: (val: any) => (typeof val === 'number' ? '৳' + val.toLocaleString('en-IN') : val),
          },
          gridLines: { color: '#edf2f7' },
        },
      ],
    },
    tooltips: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleFontSize: 13,
      titleFontColor: '#fff',
      bodyFontSize: 12,
      bodyFontColor: '#fff',
      cornerRadius: 8,
    },
  };

  summary: any = {
    totalActions: 0,
    ordersCreated: 0,
    statusChanges: 0,
    ordersEdited: 0,
    sentToCourier: 0,
    activeModeratorsCount: 0,
  };
  moderatorStats: any[] = [];
  logs: any[] = [];

  private subData?: Subscription;

  constructor(
    private orderService: OrderService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.setDateShortcut('today');
  }

  ngOnDestroy(): void {
    if (this.subData) {
      this.subData.unsubscribe();
    }
  }

  setDateShortcut(shortcut: string): void {
    this.dateShortcut = shortcut;
    const now = new Date();

    switch (shortcut) {
      case 'today': {
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        this.startDate = start;
        this.endDate = now;
        break;
      }
      case 'yesterday': {
        const yStart = new Date(now);
        yStart.setDate(yStart.getDate() - 1);
        yStart.setHours(0, 0, 0, 0);
        const yEnd = new Date(yStart);
        yEnd.setHours(23, 59, 59, 999);
        this.startDate = yStart;
        this.endDate = yEnd;
        break;
      }
      case 'last7': {
        const start7 = new Date(now);
        start7.setDate(start7.getDate() - 7);
        start7.setHours(0, 0, 0, 0);
        this.startDate = start7;
        this.endDate = now;
        break;
      }
      case 'thisMonth': {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        this.startDate = monthStart;
        this.endDate = now;
        break;
      }
      case 'lastMonth': {
        const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
        const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        this.startDate = prevMonthStart;
        this.endDate = prevMonthEnd;
        break;
      }
      case 'last30': {
        const start30 = new Date(now);
        start30.setDate(start30.getDate() - 30);
        start30.setHours(0, 0, 0, 0);
        this.startDate = start30;
        this.endDate = now;
        break;
      }
      case 'all': {
        this.startDate = null;
        this.endDate = null;
        break;
      }
      case 'custom': {
        // keep current date selection
        break;
      }
    }

    this.currentPage = 1;
    this.fetchReport();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.fetchReport();
  }

  onCustomDateChange(): void {
    this.dateShortcut = 'custom';
    this.currentPage = 1;
    this.fetchReport();
  }

  selectModerator(adminId: string): void {
    this.selectedAdminId = adminId;
    this.currentPage = 1;
    this.fetchReport();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 1;
    this.fetchReport();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchReport();
  }

  fetchReport(): void {
    this.isLoading = true;
    this.spinner.show();

    const payload: any = {
      page: this.currentPage,
      pageSize: this.pageSize,
    };

    if (this.selectedAdminId && this.selectedAdminId !== 'all') {
      payload.adminId = this.selectedAdminId;
    }
    if (this.startDate) {
      payload.startDate = this.startDate.toISOString();
    }
    if (this.endDate) {
      payload.endDate = this.endDate.toISOString();
    }
    if (this.selectedAction && this.selectedAction !== 'all') {
      payload.actionType = this.selectedAction;
    }
    if (this.searchQuery && this.searchQuery.trim()) {
      payload.search = this.searchQuery.trim();
    }

    if (this.subData) {
      this.subData.unsubscribe();
    }

    this.subData = this.orderService.getModeratorActivityReport(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.spinner.hide();
        if (res.success && res.data) {
          this.summary = res.data.summary || this.summary;
          this.moderatorStats = res.data.moderatorStats || [];
          this.logs = res.data.logs || [];
          this.totalLogs = res.data.count || 0;
          if (res.data.statusSummary) {
            this.statusSummary = res.data.statusSummary;
          }
          if (res.data.deliveryLeaderboard) {
            this.deliveryLeaderboard = res.data.deliveryLeaderboard;
          }
          this.topModerator = res.data.topModerator || null;
          if (res.data.allAdmins) {
            this.allAdmins = res.data.allAdmins;
          }
          this.buildChart();
        } else {
          this.uiService.warn(res.message || 'Failed to fetch report');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.spinner.hide();
        console.error('Moderator report error', err);
        this.uiService.warn('Error fetching moderator activity report');
      },
    });
  }

  exportToExcel(): void {
    if (!this.logs || this.logs.length === 0) {
      this.uiService.warn('No activity logs to export');
      return;
    }

    const exportData = this.logs.map((log) => ({
      'Date & Time': this.utilsService.getDateString(log.date) + ' ' + (log.date ? new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''),
      'Moderator Name': log.adminName || 'Unknown',
      'Moderator Username': log.adminUsername || '-',
      'Role': log.adminRole || '-',
      'Action': log.action,
      'Order ID': log.orderId || '-',
      'Customer Name': log.customerName || '-',
      'Customer Phone': log.customerPhone || '-',
      'Details': log.description || '-',
      'Order Value (BDT)': log.grandTotal || 0,
      'Current Status': this.getStatusLabel(log.currentStatus),
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Moderator Activity');

    const fileName = `Moderator_Activity_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
    this.uiService.success('Exported report to Excel successfully');
  }

  getActionBadgeClass(action: string): string {
    switch (action) {
      case 'Order Created':
        return 'badge-created';
      case 'Status Changed':
        return 'badge-status';
      case 'Order Edited':
        return 'badge-edited';
      case 'Sent to Courier':
        return 'badge-courier';
      default:
        return 'badge-default';
    }
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Pending';
      case OrderStatus.CONFIRM:
        return 'Confirmed';
      case OrderStatus.PROCESSING:
        return 'Processing';
      case OrderStatus.SHIPPING:
        return 'Shipped';
      case OrderStatus.DELIVERED:
        return 'Delivered';
      case OrderStatus.CANCEL:
        return 'Canceled';
      case OrderStatus.REFUND:
        return 'Refunded';
      case OrderStatus.DRAFT:
        return 'Draft';
      case OrderStatus.SENT_TO_COURIER:
        return 'Sent to Courier';
      default:
        return status !== undefined && status !== null ? `Status (${status})` : '-';
    }
  }

  getStatusBadgeClass(status: number): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'status-pending';
      case OrderStatus.CONFIRM:
        return 'status-confirm';
      case OrderStatus.PROCESSING:
        return 'status-processing';
      case OrderStatus.SHIPPING:
      case OrderStatus.SENT_TO_COURIER:
        return 'status-shipping';
      case OrderStatus.DELIVERED:
        return 'status-delivered';
      case OrderStatus.CANCEL:
      case OrderStatus.REFUND:
        return 'status-cancel';
      default:
        return 'status-default';
    }
  }

  getAdminInitials(name: string): string {
    if (!name) return 'M';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  setChartMetric(metric: 'revenue' | 'orders' | 'activity'): void {
    this.activeChartMetric = metric;
    this.buildChart();
  }

  buildChart(): void {
    if (this.activeChartMetric === 'revenue') {
      this.buildRevenueChart();
    } else if (this.activeChartMetric === 'orders') {
      this.buildOrdersChart();
    } else {
      this.buildActivityChart();
    }
  }

  private buildRevenueChart(): void {
    const list = this.deliveryLeaderboard && this.deliveryLeaderboard.length > 0 ? this.deliveryLeaderboard : [];

    this.chartLabels = list.map((m) => m.name || m.username || 'Unknown');

    this.chartData = [
      {
        data: list.map((m) => m.deliveredAmount || 0),
        label: 'সফল ডেলিভার্ড টাকা (Delivered BDT)',
        backgroundColor: '#10b981',
        hoverBackgroundColor: '#059669',
        borderColor: '#059669',
        borderWidth: 1,
      },
      {
        data: list.map((m) => m.confirmedAmount || 0),
        label: 'কনফার্মড মোট টাকা (Confirmed BDT)',
        backgroundColor: '#60a5fa',
        hoverBackgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
        borderWidth: 1,
      },
    ];

    this.chartOptions = {
      ...this.chartOptions,
      scales: {
        xAxes: [
          {
            gridLines: { display: false },
            ticks: { fontColor: '#4a5568', fontStyle: '600' },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              fontColor: '#718096',
              callback: (val: any) => (typeof val === 'number' ? '৳' + val.toLocaleString('en-IN') : val),
            },
            gridLines: { color: '#edf2f7' },
          },
        ],
      },
      tooltips: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFontSize: 13,
        titleFontColor: '#fff',
        bodyFontSize: 12,
        bodyFontColor: '#fff',
        cornerRadius: 8,
        callbacks: {
          label: (tooltipItem: any, data: any) => {
            const datasetLabel = data.datasets?.[tooltipItem.datasetIndex || 0]?.label || '';
            const value = tooltipItem.yLabel;
            if (typeof value === 'number') {
              return `${datasetLabel}: ৳${value.toLocaleString('en-IN')}`;
            }
            return `${datasetLabel}: ${value}`;
          },
        },
      },
    };
  }

  private buildOrdersChart(): void {
    const list = this.deliveryLeaderboard && this.deliveryLeaderboard.length > 0 ? this.deliveryLeaderboard : [];

    this.chartLabels = list.map((m) => m.name || m.username || 'Unknown');

    this.chartData = [
      {
        data: list.map((m) => m.delivered || 0),
        label: 'সফল ডেলিভার্ড অর্ডার (টি)',
        backgroundColor: '#10b981',
        hoverBackgroundColor: '#059669',
      },
      {
        data: list.map((m) => m.totalConfirmed || 0),
        label: 'মোট কনফার্মড অর্ডার (টি)',
        backgroundColor: '#3b82f6',
        hoverBackgroundColor: '#2563eb',
      },
      {
        data: list.map((m) => (m.cancelled || 0) + (m.refunded || 0)),
        label: 'বাতিল / রিফান্ড (টি)',
        backgroundColor: '#f87171',
        hoverBackgroundColor: '#ef4444',
      },
    ];

    this.chartOptions = {
      ...this.chartOptions,
      scales: {
        xAxes: [
          {
            gridLines: { display: false },
            ticks: { fontColor: '#4a5568', fontStyle: '600' },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              fontColor: '#718096',
              callback: (val: any) => (typeof val === 'number' ? val.toLocaleString('en-IN') + ' টি' : val),
            },
            gridLines: { color: '#edf2f7' },
          },
        ],
      },
      tooltips: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFontSize: 13,
        titleFontColor: '#fff',
        bodyFontSize: 12,
        bodyFontColor: '#fff',
        cornerRadius: 8,
        callbacks: {
          label: (tooltipItem: any, data: any) => {
            const datasetLabel = data.datasets?.[tooltipItem.datasetIndex || 0]?.label || '';
            const value = tooltipItem.yLabel;
            return `${datasetLabel}: ${value} টি`;
          },
        },
      },
    };
  }

  private buildActivityChart(): void {
    const list = this.moderatorStats && this.moderatorStats.length > 0 ? this.moderatorStats : [];

    this.chartLabels = list.map((m) => m.name || m.username || 'Unknown');

    this.chartData = [
      {
        data: list.map((m) => m.ordersCreated || 0),
        label: 'তৈরি করা অর্ডার (Orders Created)',
        backgroundColor: '#10b981',
      },
      {
        data: list.map((m) => m.statusChanges || 0),
        label: 'স্ট্যাটাস পরিবর্তন (Status Changes)',
        backgroundColor: '#3b82f6',
      },
      {
        data: list.map((m) => m.ordersEdited || 0),
        label: 'অর্ডার এডিট (Orders Edited)',
        backgroundColor: '#f59e0b',
      },
      {
        data: list.map((m) => m.sentToCourier || 0),
        label: 'কুরিয়ারে প্রেরণ (Sent to Courier)',
        backgroundColor: '#8b5cf6',
      },
    ];

    this.chartOptions = {
      ...this.chartOptions,
      scales: {
        xAxes: [
          {
            gridLines: { display: false },
            ticks: { fontColor: '#4a5568', fontStyle: '600' },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              fontColor: '#718096',
              callback: (val: any) => (typeof val === 'number' ? val.toLocaleString('en-IN') : val),
            },
            gridLines: { color: '#edf2f7' },
          },
        ],
      },
      tooltips: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFontSize: 13,
        titleFontColor: '#fff',
        bodyFontSize: 12,
        bodyFontColor: '#fff',
        cornerRadius: 8,
        callbacks: {
          label: (tooltipItem: any, data: any) => {
            const datasetLabel = data.datasets?.[tooltipItem.datasetIndex || 0]?.label || '';
            const value = tooltipItem.yLabel;
            return `${datasetLabel}: ${value}`;
          },
        },
      },
    };
  }
}
