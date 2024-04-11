import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { Routes, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { Provider } from '@angular/core';

// Injection token for the Http Interceptors multi-provider
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NoopInterceptor } from './app/http-interceptors/http-interceptor';

/** Provider for the Noop Interceptor. */
export const noopInterceptorProvider: Provider =
  { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true }; // Notice the multi: true option. This required setting tells Angular that HTTP_INTERCEPTORS is a token for a multiprovider that injects an array of values, rather than a single value.


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(HttpClientModule), noopInterceptorProvider],
};
