import { Component, OnInit } from '@angular/core';
import { Chart, registerables} from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  imports: [],
  templateUrl: './charts.html',
  styleUrl: './charts.css'
})
export class Charts implements OnInit {

  public config: any = {
    type: 'bar',
    data: {
      labels: ['1','2','3','4'],
      datasets:[
        {label: 'teste',
          data: ['100', '12', '144', '200'],
        },
        {label: 'teste2',
          data: ['10', '50', '13', '2'],
        }
      ],
    },
    options: {
      apectRatio: 1,
    }
  }
  chart: any

  ngOnInit(){
    this.chart = new Chart('Nome', this.config)
  }
}
