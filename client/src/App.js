import React, { Component } from "react";
import axios from "axios";

import { getFromStorage, setInStorage } from "../src/utils/storage";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: "",
      signUpError: "",
      signInError: "",
      signInEmail: "",
      signInPassword: "",
      signUpFirstName: "",
      signUpLastName: "",
      signUpEmail: "",
      signUpPassword: "",
    };
  }

  onTextboxChangeSignInEmail = (e) => {
    this.setState({
      signInEmail: e.target.value,
    });
  };
  onTextboxChangeSignInPassword = (e) => {
    this.setState({
      signInPassword: e.target.value,
    });
  };
  onTextboxChangeSignUpEmail = (e) => {
    this.setState({
      signUpEmail: e.target.value,
    });
  };
  onTextboxChangeSignUpPassword = (e) => {
    this.setState({
      signUpPassword: e.target.value,
    });
  };
  onTextboxChangeSignUpFirstName = (e) => {
    this.setState({
      signUpFirstName: e.target.value,
    });
  };
  onTextboxChangeSignUpLastName = (e) => {
    this.setState({
      signUpLastName: e.target.value,
    });
  };

  componentDidMount() {
    const obj = getFromStorage("the_main_app");

    if (obj && obj.token) {
      const { token } = obj;
      axios
        .get("/api/account/verify?token=" + token, {
          headers: { "Content-Type": "application/json" },
        })
        .then((json) => {
          if (json.data.success) {
            this.setState({
              token,
              isLoading: false,
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  onSignUp = () => {
    const {
      signUpEmail,
      signUpFirstName,
      signUpLastName,
      signUpPassword,
    } = this.state;
    this.setState({
      isLoading: true,
    });
    axios
      .post(
        "/api/account/signup",
        {
          firstName: signUpFirstName,
          lastName: signUpLastName,
          email: signUpEmail,
          password: signUpPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((json) => {
        if (json.data.success) {
          this.setState({
            signUpError: json.data.message,
            isLoading: true,
          });
        } else {
          this.setState({
            signUpError: json.data.message,
            isLoading: false,
          });
        }
      });
  };

  onSignIn = () => {
    const { token, signInEmail, signInPassword } = this.state;

    axios
      .post(
        "/api/account/signin",
        {
          email: signInEmail,
          password: signInPassword,
          token: token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((json) => {
        if (json.data.success) {
          setInStorage("the_main_app", { token: json.data.token });
          this.setState({
            signInError: json.data.message,
            isLoading: true,
          });
        } else {
          this.setState({
            signInError: json.data.message,
            isLoading: false,
          });
        }
      });
  };

  logOut = () => {
    const obj = getFromStorage("the_main_app");

    if (obj && obj.token) {
      const { token } = obj;
      axios
        .get("/api/account/logout?token=" + token, {
          headers: { "Content-Type": "application/json" },
        })
        .then((json) => {
          if (json.data.success) {
            this.setState({
              token: "",
              isLoading: false,
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  };

  render() {
    const {
      isLoading,
      token,
      signUpError,
      signInError,
      signInEmail,
      signInPassword,
      signUpEmail,
      signUpFirstName,
      signUpLastName,
      signUpPassword,
    } = this.state;

    if (!token) {
      return (
        <div>
          <div>
            {signInError == "Valid sign in"
              ? window.location.reload(false)
              : null}
            {signInError ? <p>{signInError}</p> : null}

            <p>Sign In</p>
            <input
              onChange={this.onTextboxChangeSignInEmail}
              placeholder="Email"
              type="email"
              value={signInEmail}
            />
            <br />
            <input
              onChange={this.onTextboxChangeSignInPassword}
              placeholder="Password"
              type="password"
              value={signInPassword}
            />
            <br />
            <button onClick={this.onSignIn}>Sign In</button>
          </div>
          <div>
            {signUpError ? <p>{signUpError}</p> : null}
            <p>Sign Up</p>
            <input
              onChange={this.onTextboxChangeSignUpFirstName}
              placeholder="firstName"
              type="text"
              value={signUpFirstName}
            />
            <br />
            <input
              onChange={this.onTextboxChangeSignUpLastName}
              placeholder="lastName"
              type="text"
              value={signUpLastName}
            />
            <br />
            <input
              onChange={this.onTextboxChangeSignUpEmail}
              placeholder="Email"
              type="email"
              value={signUpEmail}
            />
            <br />
            <input
              onChange={this.onTextboxChangeSignUpPassword}
              placeholder="Password"
              type="password"
              value={signUpPassword}
            />
            <br />
            <button onClick={this.onSignUp}>Sign Up</button>
          </div>
        </div>
      );
    }
    return (
      <>
        <p>Account</p>
        <button onClick={this.logOut}>Log out</button>
      </>
    );
  }
}

export default App;
