import { Action } from '@ngrx/store';

export class UserAction implements Action {
  type: string;
  payload: { name: string };

  constructor(id: number, payload: string) {
    this.type = `Form-${id}`;
    this.payload = { name: payload };
  }
}
