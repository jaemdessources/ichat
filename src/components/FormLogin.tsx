import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import userService from "@/services/user";
import * as styles from "@/styles/UnauthApp";
import { UserContext } from "@/pages";
interface FormLoginProps {
  create: boolean;

  setStatus: Function;
  setError: Function;
}

function FormLogin({
  create = false,

  setError,
  setStatus,
}: FormLoginProps) {
  const userContext = React.useContext(UserContext);

  const [checked, setChecked] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [cPassword, setCPassword] = React.useState("");
  const [name, setName] = React.useState("");

  const label = create ? "Signup" : "Login";

  const handleRegister = () =>
    userService.register({
      name,
      username,
      cPassword,
      password,
    });

  const handleLogin = async () => {
    setStatus("fetching");
    userService
      .login({ username, password })
      .then((user) => {
        userContext?.setUser(user);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => setStatus("done"));
  };

  const handleSubmit = create ? handleRegister : handleLogin;

  return (
    <form
      style={styles.root}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      {create ? (
        <TextField
          id="filled-basic"
          label="Name"
          variant="filled"
          sx={{ color: "var(--accent-color)" }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ opacity: "1" }}
        />
      ) : null}
      <TextField
        id="filled-basic"
        label="Username"
        variant="filled"
        sx={{ color: "var(--accent-color)" }}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ opacity: "1" }}
      />
      <TextField
        id="filled-basic"
        type="password"
        label="Password"
        variant="filled"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {create ? (
        <TextField
          id="filled-basic"
          type="password"
          label="Confirm Password"
          variant="filled"
          value={cPassword}
          onChange={(e) => setCPassword(e.target.value)}
        />
      ) : null}
      {create ? (
        <>
          <Button
            style={styles.submit}
            variant="contained"
            color="secondary"
            onClick={handleRegister}
          >
            {label}
          </Button>

          <small>This page is protected by Google reCAPTCHA</small>
        </>
      ) : (
        <>
          <Button
            style={styles.submit}
            variant="contained"
            color="secondary"
            onClick={handleLogin}
          >
            {label}
          </Button>
          <div>
            {" "}
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    name="checkedA"
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                  />
                }
                label={
                  <Typography
                    component={"span"}
                    style={styles.checkBoxText}
                  >
                    Remember me
                  </Typography>
                }
              />
            </FormGroup>
          </div>
        </>
      )}
    </form>
  );
}

export default FormLogin;
