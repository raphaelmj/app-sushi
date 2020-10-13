import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { NavPage } from "./model/nav-page";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() pages: number;
  @Input() current: number;
  @Output() emitChange: EventEmitter<any> = new EventEmitter<any>();
  pagination: NavPage[];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pages) {
      this.createPaginationViewData();
    }
    if (changes.current) {
      if (!changes.current.firstChange) {
        this.createPaginationViewData();
      }
    }
  }

  createPaginationViewData() {
    var pgs = [];

    if (typeof this.current == "string") {
      this.current = parseInt(this.current);
    }

    for (var i = 0; i < this.pages; i++) {
      var act = false;
      if (i + 1 == this.current) {
        act = true;
      }

      pgs.push({
        nr: i + 1,
        active: act,
      });
    }

    this.pagination = pgs;
  }

  changePag(p: NavPage) {
    this.emitChange.emit(p);
  }

  change(action: "prev" | "next") {
    switch (action) {
      case "next":
        if (this.current < this.pages) {
          this.current++;
          // console.log(this.current);
          this.emitChange.emit(this.current);
        }

        break;
      case "prev":
        if (this.current > 1) {
          this.current--;
          // console.log(this.current);
          this.emitChange.emit(this.current);
        }

        break;
    }
  }
}
