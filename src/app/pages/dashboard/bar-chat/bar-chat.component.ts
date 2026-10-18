import {Component, OnInit} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {DashboardService} from "../../../services/common/dashboard.service";
import {Label} from "ng2-charts";

@Component({
  selector: 'app-bar-chat',
  templateUrl: './bar-chat.component.html',
  styleUrls: ['./bar-chat.component.scss']
})
export class BarChatComponent implements OnInit {
public barChartOptions: ChartOptions = {
    responsive: true,
  };
public barChartLabels: Label[] = [];
public barChartType: ChartType = 'bar';
public barChartLegend = true;
public selectedData:any;

public barChartData: ChartDataSets[] = [
    {
      data: [],
      label: '',
      backgroundColor: [], // Initialize as an empty array
    },
  ];

  constructor(private dashboardService: DashboardService) {} // Inject the service

  ngOnInit(): void {
    this.changeData('monthly'); // Set default to monthly data on load
  }

  // Method to change chart data based on period (Yearly, Monthly, Weekly)
  changeData(period: string): void {
    this.selectedData = period;
    this.dashboardService.getSalesData(period).subscribe((response: any) => {
      const dynamicColors = this.generateColors(response.sales.length);

      if (period === 'yearly') {
        this.barChartData[0].data = response.sales;
        this.barChartLabels = response.labels;
        this.barChartData[0].label = 'Yearly Sales';
        this.barChartData[0].backgroundColor = dynamicColors;
      } else if (period === 'monthly') {
        this.barChartData[0].data = response.sales;
        this.barChartLabels = response.labels;
        this.barChartData[0].label = 'Monthly Sales';
        this.barChartData[0].backgroundColor = dynamicColors;
      } else if (period === 'weekly') {
        this.barChartData[0].data = response.sales;
        this.barChartLabels = response.labels;
        this.barChartData[0].label = 'Weekly Sales';
        this.barChartData[0].backgroundColor = dynamicColors;
      }
    });
  }

  // Helper method to generate random colors for each bar
  generateColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`;
      colors.push(color);
    }
    return colors;
  }
}
