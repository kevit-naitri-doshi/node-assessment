import App from './app.js';
import UsersRoute from './components/user/user.routes.js';
import EventsRoute from './components/events/events.routes.js';

const app = new App([new UsersRoute(), new EventsRoute()]);

app.listen();
