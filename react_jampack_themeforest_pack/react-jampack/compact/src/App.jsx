import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import AuthRoutes from './routes/AuthRoutes';
import ScrollToTop from './utils/ScrollToTop';
import IndexRoute from './routes';

function App() {

  return (
    <>
      <BrowserRouter>
        <BrowserRouter >
          <ScrollToTop>
            <Switch>
              <Redirect exact from="/" to="/dashboard" />
              {/* Auth */}
              <Route path="/auth" render={(props) => <AuthRoutes {...props} />} />
              {/* Layouts */}
              <Route path="/" render={(props) => <IndexRoute {...props} />} />
            </Switch>
          </ScrollToTop>
        </BrowserRouter>
      </BrowserRouter>
    </>
  );
}

export default App;
