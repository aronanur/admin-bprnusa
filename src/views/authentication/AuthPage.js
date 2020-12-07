import React, { useEffect, useCallback } from 'react';
import { loggedUser } from '../../store/actions/actionUser';
import { bprNusaServer } from '../../server/api';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

export default function AuthPage({ children, ...rest }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.userReducer.loginStatus);
  const userData = useSelector(state => state.userReducer.user);

  const checkLoggedUser = useCallback(async () => {
    try {
      const { data } = await bprNusaServer.get("/users/admin/auth-admin", {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        if (data.statusCode === 200) {
          dispatch(loggedUser(data.body));
        } else {
          localStorage.removeItem("admin_access_token");
          toast.error("⚠ " + data.message);
        }
      }

    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
      localStorage.removeItem("admin_access_token");
      history.push("/");
    }
  }, [dispatch, history])

  const generateView = () => {
    if (userData) {
      return (
        <Route
          {...rest}
          render={({ location }) =>
            isLoggedIn ? (
              children
            ) : (
                <Redirect
                  to={{
                    pathname: "/",
                    state: { from: location }
                  }}
                />
              )
          }
        >
        </Route>
      );
    } else {
      return (
        <div className="pt-3 text-center">
          <div className="sk-spinner sk-spinner-pulse"></div>
        </div>
      );
    }
  }

  useEffect(() => {
    if (localStorage.admin_access_token) {
      checkLoggedUser();
    } else {
      toast.error(" ⚠ Anda belum login")
      history.push("/");
    }
  }, [checkLoggedUser, history]);

  return (
    <>
      <ToastContainer />
      { generateView()}
    </>
  );
}