import { Component, OnInit } from '@angular/core';
import { ReducerManager } from '@ngrx/store';

@Component({
  selector: 'app-empty',
  template: '<p>Empty Page check State</p>',
})
export class EmptyComponent implements OnInit {
  constructor(private reducerManager: ReducerManager) {
  }

  public ngOnInit(): void {
    this.reducerManager.addReducer('empty', this.emptyReducer);
  }

  private emptyReducer() {
    return (state = { example: true }) => {
      return { ...state, example: true };
    };
  }
}
