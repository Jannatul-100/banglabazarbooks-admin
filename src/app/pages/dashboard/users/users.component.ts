import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartComponent} from "ng-apexcharts";
import {DashboardService} from "../../../services/common/dashboard.service";
import {AdminService} from "../../../services/admin/admin.service";
import {Subscription} from "rxjs";
import {ChartOptions} from "../donut/donut.component";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(
    private dashboardService: DashboardService,
    private adminService: AdminService
  ) {
    this.chartOptions = {
      series: [0, 0, 0, 0],
      chart: {
        width: 300,
        type: 'pie',
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  USER_ROLE: any;
  orderDashboard: any;
  maleCustomer: any;
  femaleCustomer: any;
  UndefinedCustomer: any;

  // Subscriptions
  private subDataOne: Subscription;

  ngOnInit(): void {
    this.USER_ROLE = this.adminService.getAdminRole();

    this.subDataOne = this.dashboardService.getOrderDashboard().subscribe({
      next: (res) => {
        this.orderDashboard = res?.data;

        this.maleCustomer = this.orderDashboard?.totalMaleCustomerCount;
        this.femaleCustomer = this.orderDashboard?.totalFemaleCustomerCount;
        this.UndefinedCustomer = this.orderDashboard?.totalUndefinedCustomerCount;


        // rount chart
        const mul: any[] = [
          this.maleCustomer,
          this.femaleCustomer,
          this.UndefinedCustomer,
        ];
        this.chartOptions = {
          series: mul,
          chart: {
            width: 300,
            type: 'pie',
          },
          labels: [
            'Male',
            'Female',
            'Undefinite',
          ],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 300,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        };
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  /**
   * NG ON DESTROY
   */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }
}
