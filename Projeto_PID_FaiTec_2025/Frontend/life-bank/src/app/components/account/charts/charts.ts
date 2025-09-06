import { Component, OnInit } from '@angular/core';
import { Chart, registerables}  from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  imports: [],
  templateUrl: './charts.html',
  styleUrl: './charts.css'
})
export class Charts implements OnInit {
  bloodbankChart: any
  weeklyChart: any
  returnalChart: any

  ngOnInit(){
    this.castChart_BloodBank()
    this.castChart_WeeklyChart()
    this.castChart_ReturnalChart()
  }

  castChart_BloodBank(){
    this.bloodbankChart = new Chart('BloodBank', {
      type: 'bar',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks:{
              font:{
                family: 'Be Vietnam Pro',
              }
            },
            grid:{
              display: false
            }
          },
          y: {
            ticks:{
              font:{
                family: 'Be Vietnam Pro',
              },
              callback: function(value, index, ticks) {
                return value + ' L'; // Appends ' m' to each tick value
            }
            }
          }
        }
      },
      data: {
        labels: ['A+','A-','B+','B-','AB+','AB-','O+','O-'],
        datasets: [
          {
            data: [1,2,3,4,5,6,7,8],
            backgroundColor: [
              '#6EA8FF',
              '#4A7CE9',
              '#60EF97',
              '#44C29E',
              '#FFD859',
              '#FF9C46',
              '#FF5168',
              '#EF60BB'
            ],
            borderRadius: 15
          }
        ]
      },
    })
  }

  castChart_WeeklyChart(){
    this.weeklyChart = new Chart('WeeklyChart', {
      type: 'bar',
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            display: true,
            labels:{
              font:{
                family: 'Be Vietnam Pro',
              }
            }
          }
        },
        scales: {
          x:{
            stacked: true,
            ticks:{
              font:{
                family: 'Be Vietnam Pro',
              }
            },
            grid:{
              display: false
            }
          },
          y:{
            stacked: true,
            ticks:{
              font:{
                family: 'Be Vietnam Pro',
              },
              callback: function(value, index, ticks) {
                return value + ' L'; // Appends ' m' to each tick value
            }
            }
          }
        }
      },
      data: {
        labels: ['seg','ter','qua','qui','sex','sab','dom'],
        datasets: [
          {
            data: [1,2,3,4,5,6,7,8],
            label: 'A+',
            backgroundColor: '#6EA8FF',
            borderRadius: 15
          },
          {
            data: [1,2,3,4,5,6,7,8],
            label: 'A-',
            backgroundColor: '#4A7CE9',
            borderRadius: 15
          },
          {
            data: [1,2,3,4,5,6,7,8],
            label: 'B+',
            backgroundColor: '#60EF97',
            borderRadius: 15
          },
          {
            data: [1,2,3,4,5,6,7,8],
            label: 'B-',
            backgroundColor: '#44C29E',
            borderRadius: 15
          },
          {
            data: [1,2,3,4,5,6,7,8],
            label: 'AB+',
            backgroundColor: '#FFD859',
            borderRadius: 15
          },
          {
            data: [1,2,3,4,5,6,7,8],
            label: 'AB-',
            backgroundColor: '#FF9C46',
            borderRadius: 15
          },
          {
            data: [1,2,3,4,5,6,7,8],
            label: 'O+',
            backgroundColor: '#FF5168',
            borderRadius: 15
          },
          {
            data: [1,2,3,4,5,6,7,8],
            label: 'O-',
            backgroundColor: '#EF60BB',
            borderRadius: 15
          }
        ]
      },
    })
  }

  castChart_ReturnalChart(){
    this.returnalChart = new Chart('ReturnalChart', {
      type: 'doughnut',
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: 'left',
            display: true,
            labels:{
              font:{
                family: 'Be Vietnam Pro',
              }
            }
          }
        },
        
      },
      
      data: {
        labels: ['>120dias','<120dias','novos cadastrados'],
        datasets: [
          {
            data: [5, 2, 3],
            backgroundColor: [
              '#60EF97',
              '#FF5168',
              '#6EA8FF'
            ],
            borderRadius: 15
          },
        ]
      },
    })
  }
}
