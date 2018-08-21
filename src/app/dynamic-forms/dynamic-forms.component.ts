import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { ActionReducer, ReducerManager, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { debounceTime, first } from 'rxjs/operators';
import { UserAction } from './+state/users.action';

import { State as UserState } from './+state/users.state';

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.css'],
})
export class DynamicFormsComponent implements OnInit, OnDestroy {

  public form: FormGroup;

  private userId = 0;
  private subscriptions: Subscription[] = [];
  private usersArray: UserState[] = [];

  public constructor(private reducerManager: ReducerManager,
                     private formBuilder: FormBuilder,
                     private store: Store<UserState>,
                     private http: HttpClient) {
  }

  public ngOnInit(): void {
    this.loadUsers();
    this.form = this.formBuilder.group({
      users: this.formBuilder.array([]),
    });
    // this.generateUsers();
  }

  public ngOnDestroy(): void {
    const selectors = this.usersArray.map((user: UserState) => {
      return `Form-${user.id}`;
    });
    this.reducerManager.removeReducers(selectors);

    this.subscriptions
      .forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public get users(): FormArray {
    return this.form.get('users') as FormArray;
  }

  public addUser(user: UserState = { id: this.userId, name: '' }): void {
    const selector = 'Form-' + user.id;

    this.reducerManager
      .addReducer(selector, this.createFormReducer(user));

    this.store
      .select(selector)
      .pipe(first())
      .subscribe((form: UserState) => this.createUserForm(form));

    this.usersArray.push(user);
    this.userId = user.id + 1;
  }

  private createFormReducer(user: UserState): ActionReducer<UserState> {
    return (state: UserState = user, action: UserAction): UserState => {
      if ( action.type === `Form-${state.id}` ) {
        return {
          ...state,
          ...action.payload,
        };
      }
      return { ...state };
    };
  }

  private createUserForm(user: UserState): void {
    const id = this.userId;

    this.users.push(this.formBuilder.control(user.name));

    this.createInputSubscription(id);

  }

  private createInputSubscription(id: number): void {
    const subscription = this.users.at(id).valueChanges
      .pipe(debounceTime(1000))
      .subscribe(value => this.store.dispatch(new UserAction(id, value)));

    this.subscriptions.push(subscription);
  }

  private loadUsers(): void {
    this.http.get('/assets/users.json')
      .pipe(first())
      .subscribe((data: { users: UserState[] }) => {
        this.usersArray = data.users.slice();
        data.users.forEach(user => this.addUser(user));
      });
  }

  private generateUsers(count: number = 100): void {
    const array = new Array(count).fill(null);
    array.forEach((v, i) => this.addUser({ id: i, name: `Generated Name ${i}` }));
  }
}
