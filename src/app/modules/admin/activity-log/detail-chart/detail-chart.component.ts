import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import Chart from "chart.js/auto";

@Component({
  selector: 'app-detail-chart',
  templateUrl: './detail-chart.component.html',
  styleUrls: ['./detail-chart.component.scss']
})
export class DetailChartComponent implements OnInit {
  myChartDetail: any;
  dataChartDetail: any
  title: any;

  constructor(private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    if (this.dataChartDetail) {
      this.getChart('myChartDetail', 'dataChartDetail');
    }
  }

  getChart(nameChart, nameData) {
    if (document.getElementById(nameChart)) {
      if (this[nameChart]) {
        this[nameChart].destroy();
      }
      const ctx = document.getElementById(nameChart);
      this[nameChart] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this[nameData].map(i => i.name),
          datasets: [{
            data: this[nameData].map(i => i.count),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          onHover: (event, chartElement) => {
            event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
          },
          layout: {
            padding: 20,
          },
          scales: {
            y: {
              beginAtZero: true
            }
          },
          responsive: true,
          animation: true,
          plugins: {
            datalabels: {
              color: 'black',
              anchor: 'end',
              align: 'end',
              padding: 1,
              clamp: true,
              font: {
                weight: "bold",
              },
            },
            legend: {
              display: false
            },
            tooltip: {
              enabled: true
            }
          }
        },
      })
    }
  }

  public decline() {
    this.activeModal.close();
  }
}
