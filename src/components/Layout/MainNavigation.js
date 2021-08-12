import { Link, useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import { Fragment, useContext } from 'react';
import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const history = useHistory();

  const onLogoutHandler = () => {
    authCtx.logOutHandler();
    history.replace('/auth');
  };
  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {isLoggedIn && (
            <Fragment>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={onLogoutHandler}>Logout</button>
              </li>
            </Fragment>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
