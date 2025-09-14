// import { ApplicationConfig, importProvidersFrom } from '@angular/core';
// import { provideAnimations } from '@angular/platform-browser/animations'; // ✅ Required
// import { provideRouter, withEnabledBlockingInitialNavigation, withHashLocation, withInMemoryScrolling, withRouterConfig, withViewTransitions } from '@angular/router';

// import { DropdownModule, SidebarModule } from '@coreui/angular';
// import { IconSetService } from '@coreui/icons-angular';
// import { routes } from './app.routes';
// import { provideToastr } from 'ngx-toastr';
// import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
// import { NgxEditorModule, schema } from 'ngx-editor';
// import {AuthInterceptor} from './admin/AuthInterceptor';

import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling, withRouterConfig, withViewTransitions } from '@angular/router';

import { DropdownModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { NgxEditorModule } from 'ngx-editor';
import { authInterceptor } from './admin/AuthInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
    // withHashLocation()

    ),
    importProvidersFrom(SidebarModule, DropdownModule),
    IconSetService,

    provideAnimations(),
    provideToastr(),

    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])


    ),
    importProvidersFrom(
      NgxEditorModule.forRoot({
        locals: {
          // menu
          bold: 'Bold',
          italic: 'Italic',
          code: 'Code',
          blockquote: 'Blockquote',
          underline: 'Underline',
          strike: 'Strike',
          bullet_list: 'Bullet List',
          ordered_list: 'Ordered List',
          heading: 'Heading',
          h1: 'Header 1',
          h2: 'Header 2',
          h3: 'Header 3',
          h4: 'Header 4',
          h5: 'Header 5',
          h6: 'Header 6',
          align_left: 'Left Align',
          align_center: 'Center Align',
          align_right: 'Right Align',
          align_justify: 'Justify',
          text_color: 'Text Color',
          background_color: 'Background Color',
  
          // popups, forms, others...
          url: 'URL',
          text: 'Text',
          openInNewTab: 'Open in new tab',
          insert: 'Insert',
          altText: 'Alt Text',
          title: 'Title',
          remove: 'Remove',
          enterValidUrl: 'Please enter a valid URL',
        },
      }),
    ),
    
  
  ]
};
