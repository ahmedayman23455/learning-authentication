import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';
import { useHistory } from 'react-router-dom';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const enteredEmail = useRef();
  const enteredPassword = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  /* ----------------------------- submit function ---------------------------- */
  const submitHandler = (event) => {
    event.preventDefault();
    const email = enteredEmail.current.value;
    const password = enteredPassword.current.value;
    let url;

    if (isLogin) {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAOfM1-GdixbjJCseTUSMTos8M53wjSbWY';
    } else {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAOfM1-GdixbjJCseTUSMTos8M53wjSbWY';
    }
    setIsLoading(true);

    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            const errorMessage = data.error.message;
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        const currentTime = new Date().getTime(); // milliseconds
        const endTime = new Date(
          currentTime + +data.expiresIn * 1000
        ).getTime(); //milliseconds

        authCtx.logInHandler(data.idToken, new Date(endTime).toLocaleString());

        history.replace('/');
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  /* -------------------------------------------------------------------------- */
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={enteredEmail} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required ref={enteredPassword} />
        </div>
        <div className={classes.actions}>
          {isLoading && <p style={{ color: '#fff' }}>Sending Request...</p>}
          {!isLoading && (
            <button>{isLogin ? 'Login' : 'Create Account'}</button>
          )}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
