import { QuickStats } from '~/models/quick-stats';
import { ModalDialogParams } from '@nativescript/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quick-stats',
  templateUrl: './quick-stats.component.html',
  styleUrls: ['./quick-stats.component.scss']
})
export class QuickStatsComponent implements OnInit {

  quickStats: QuickStats
  date: Date


  constructor(private params: ModalDialogParams) {
    this.quickStats = params.context.quickStats
    this.date = params.context.date
  }

  ngOnInit(): void {
  }

  close() {
    this.params.closeCallback(false)
  }

}
