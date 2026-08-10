import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import AuthRoutes from './routes/AuthRoutes';
import ScrollToTop from './utils/ScrollToTop';
import AppRoutes from './routes/AppRoutes';

function App() {

  return (
    <BrowserRouter >
      <ScrollToTop>
        <Switch>
          <Redirect exact from="/" to="/dashboard" />
          {/* Auth */}
          <Route path="/auth" render={(props) => <AuthRoutes {...props} />} />
          {/* Layouts */}
          <Route path="/" render={(props) => <AppRoutes {...props} />} />
        </Switch>
      </ScrollToTop>
    </BrowserRouter>
  );
}

export default App;
