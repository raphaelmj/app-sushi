import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, Event, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-route-loading',
  templateUrl: './route-loading.component.html',
  styleUrls: ['./route-loading.component.css']
})
export class RouteLoadingComponent implements OnInit {
  loading: boolean = false
  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd: {
          this.loading = false;
        }
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  ngOnInit(): void {
  }

}
