import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { userService } from './services';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();

//henter classene fra outlogged.js
import { StartMenu } from './outlogged'
import { Login } from './outlogged';
import { Registration } from './outlogged';
import { NewPassword } from './outlogged';
import { NewPasswordSendt } from './outlogged';

//henter classene fra users.js
import {UserMenu} from './user';
import {UserHome} from './user';
import {MyPage} from './user';


//henter classene fra admin.js
import {AdminMenu} from './admin';
import {ConfirmUsers} from './admin';
import {AdminHome} from './admin';

// 1. ReactDOM som kjører ved oppstart.
// Kjører StartMenu classen og viser forskjellige routes til andre komponenter
ReactDOM.render((
  <HashRouter>
    <div>
      {/* Definerer hvilken komponent som alltid skal vises! */}
      <StartMenu  />
      <Switch>
        {/* Routes som definerer hvilken komponent som bruker skal sendes */}
        {/* til når bestemte paths blir referert til */}
        <Route exact path='/registration' component={Registration} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/newPassword' component={NewPassword} />
        <Route exact path='/passwordsendt' component={NewPasswordSendt} />
        <Login /> {/* Definerer hvilken komponent som skal vises på 1. render */}
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'));

//ny ReactDOM som kjøres når user logger inn.
 export function checkLogInUser(user) {
  ReactDOM.render((
  <HashRouter>
    <div>
      <UserMenu userId={user.userId} />
      <Switch>
          <Route exact path='/userhome/:userId' component={UserHome} />
           <Route exact path='/mypage/:userId' component={MyPage} />

      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'))
};
//ny ReactDOM som kjøres når user admin inn.
export function checkLogInAdmin(admin) {
  ReactDOM.render((
  <HashRouter>
    <div>
      <AdminMenu />
      <Switch>
          <Route exact path='/hjem' component={AdminHome} />
         <Route exact path='/confirmusers' component={ConfirmUsers} />
           <AdminHome />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'))
};
