import App from './app.js';
import UsersRoute from './components/user/user.routes.js';
import BotsRoute from './components/bots/bots.routes.js';

const app = new App([new UsersRoute(), new BotsRoute()]);

app.listen();
