import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './components/app/app';
import { config } from './components/app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

export default bootstrap;
