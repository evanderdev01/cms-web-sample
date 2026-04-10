import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss']
})
export class PiechartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() title: any;
  @Input() dataSum: any;
  @Input() label: any;
  @Input() pieBackgroundConfig: any;
  @Input() nameChart = 'Summary Report';

  myChart: any;

  constructor() {
  }

  ngOnDestroy(): void {
    if (this.myChart) {
      this.myChart.destroy();
    }
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getChart();
  }

  ngAfterViewInit() {
    this.getChart();
  }

  getChart() {
    const dataS: any[] = [];
    Object.keys(this.dataSum).forEach((key) => {
      if (key !== 'sum_tong') {
        dataS.push(this.dataSum[key]);
      }
    })
    if (document.getElementById(this.title)) {
      if (this.myChart) {
        this.myChart.destroy();
      }
      const ctx = document.getElementById(this.title);
      this.myChart = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: 'pie',
        data: {
          labels: this.label,
          datasets: [{
            label: 'My First Dataset',
            data: dataS,
            backgroundColor: this.pieBackgroundConfig,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            datalabels: {
              color: 'white',
              display: true,
              align: 'center',
              font: {
                size: 16,
                weight: "bold",
              },
              formatter: (value, ctx) => {
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;
                dataArr.map(data => {
                  sum += data;
                });
                let percentage = (value * 100 / sum);
                if (percentage < 10) {
                  return '';
                }
                return percentage.toFixed(0) + '%';
              },
            },
            legend: {
              display: true,
              position: "bottom",
              labels: {
                generateLabels: (chart) => {
                  const datasets = chart.data.datasets;
                  return datasets[0].data.map((data, i) => ({
                    text: `${chart.data.labels[i]} ${data}`,
                    fillStyle: datasets[0].backgroundColor[i],
                  }))
                }
              }
            },
            tooltip: {
              enabled: true
            },
          }
        }
      });
    }
  }
}
