import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading-absolute',
  templateUrl: './loading-absolute.component.html',
  styleUrls: ['./loading-absolute.component.css']
})
export class LoadingAbsoluteComponent implements OnInit {

  @Input() busy: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

}
