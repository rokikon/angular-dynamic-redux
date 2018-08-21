import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import * as fromState from './+state/app.reducer';

import { AppComponent } from './app.component';
import { DynamicFormsComponent } from './dynamic-forms/dynamic-forms.component';
import { DynamicFormsModule } from './dynamic-forms/dynamic-forms.module';
import { EmptyComponent } from './empty.component';

const ROUTES = [
  {
    path: '',
    component: DynamicFormsComponent,
  },
  {
    path: 'other',
    component: EmptyComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    EmptyComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    NoopAnimationsModule,
    DynamicFormsModule,
    MatToolbarModule,
    StoreModule.forRoot({ app: fromState.reducer }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
