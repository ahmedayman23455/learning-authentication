import { useRef, useContext } from 'react';
import classes from './ProfileForm.module.css';
import AuthContext from '../../store/auth-context';

const ProfileForm = () => {
  const password = useRef();
  const authCtx = useContext(AuthContext);
  /* ----------------------------- submit function ---------------------------- */
  const submitHandler = (event) => {
    event.preventDefault();
    const enteredPassword = password.current.value;
    fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAOfM1-GdixbjJCseTUSMTos8M53wjSbWY',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application.json' },
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredPassword,
          returnSecureToken: false,
        }),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            throw new Error(data.error.message);
          });
        }
      })
      .then((data) => {
        alert('password changed successfully');
        authCtx.logOutHandler();
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  /* -------------------------------------------------------------------------- */
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={password} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
