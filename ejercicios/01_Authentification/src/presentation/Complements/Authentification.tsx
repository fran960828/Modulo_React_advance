import { Link, useSearchParams, Form } from "react-router-dom";
import classes from "./Authentification.module.css";

const AuthForm = () => {
  // Usamos searchParams para saber si estamos en modo login o signup (?mode=login)
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";

  return (
    <div className={classes.authContainer}>
      <Form method="post" className={classes.form}>
        <h1>{isLogin ? "Log in" : "Create a new user"}</h1>

        <p>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            required
            placeholder="name@example.com"
          />
        </p>

        <p>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" required />
        </p>

        <div className={classes.actions}>
          <Link
            to={`?mode=${isLogin ? "signup" : "login"}`}
            className={classes.toggle}
          >
            {isLogin ? "Create new user" : "Login with existing account"}
          </Link>
          <button className={classes.button}>
            {isLogin ? "Login" : "Save"}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default AuthForm;
