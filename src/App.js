import React from 'react';
import store from './store/index';
import AuthPage from './views/authentication/AuthPage';
import { Provider } from 'react-redux'; 
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './scss/style.scss';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const TheLayout = React.lazy(() => import('./containers/TheLayout')); 
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));

function App() { 
    return (
      <Provider store={store}>
        <Router>
            <React.Suspense fallback={loading}>
              <Switch>
                <Route exact path="/">
                  <Login />
                </Route>
                <AuthPage path="/admin">
                  <TheLayout />
                </AuthPage>
                <Route path="*">
                  <Page404 />
                </Route>
              </Switch>
            </React.Suspense>
        </Router>
      <ToastContainer /> 
      </Provider>
    );
}

export default App;
