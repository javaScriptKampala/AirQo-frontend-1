import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import { CardContent } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { clearErrors, loginUser } from "redux/Join/actions";
import Grid from "@material-ui/core/Grid";
import { isEmpty, omit } from "underscore";
import { isFormFullyFilled } from "./utils";
import usersStateConnector from "views/stateConnectors/usersStateConnector";
import AlertMinimal from "../../layouts/AlertsMininal";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

const styles = {
  textField: {
    fontWeight: "bold",
    fontSize: "20px",
  },
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.query = new URLSearchParams(this.props.location.search);
    this.tenant = this.props.match.params.tenant;
    this.state = {
      organization: this.tenant || "airqo",
      userName: "",
      password: "",
      errors: {},
      loading: false,
      showPassword: false,
    };
  }

  componentDidMount() {
    var anchorElem = document.createElement("link");
    anchorElem.setAttribute(
      "href",
      "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
    );
    anchorElem.setAttribute("rel", "stylesheet");
    anchorElem.setAttribute("id", "logincdn");

    //document.body.appendChild(anchorElem);
    document.getElementsByTagName("head")[0].appendChild(anchorElem);
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard"); // push user to dashboard when they login
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  componentWillUnmount() {
    let el = document.getElementById("logincdn");
    el.remove();
  }

  onChange = (e) => {
    e.preventDefault();
    const { id, value } = e.target;
    let errors = this.props.errors;

    if (id === "organization") {
      window.history.pushState(
        {},
        null,
        `${window.location.pathname}?${id}=${value}`
      );
    }

    errors[id] = value.length === 0 ? `This field is required` : "";

    this.setState(
      {
        errors,
        [id]: value,
      },
      () => {
        console.log(errors);
      }
    );
  };

  toggleShowPassword = () => {
    this.setState({ ...this.state, showPassword: !this.state.showPassword });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const emptyFields = isFormFullyFilled(this.state);
    const userData = omit(this.state, "errors");

    if (!isEmpty(emptyFields)) {
      this.setState({
        ...this.state,
        errors: {
          ...this.state.errors,
          ...emptyFields,
        },
      });
      return;
    }
    this.setState({ ...this.state, loading: true });
    this.props.clearErrors();
    await this.props.loginUser(userData);
    this.setState({ ...this.state, loading: false });
  };
  render() {
    const { errors } = this.state;
    return (
      <AlertMinimal>
        <div
          className="container"
          style={{
            marginTop: "4rem",
            height: "auto",
            backgroundColor: "#fff",
            maxWidth: "1000px",
          }}
        >
          <Grid container>
            <Grid
              item
              xs={12}
              sm={4}
              style={{
                padding: "1em",
                backgroundColor: "#3067e2",
                height: "100% !important",
                minHeight: "100px",
              }}
            />
            <Grid item xs={12} sm={8}>
              <div style={{ margin: "10px" }}>
                <div>
                  <h4>
                    <b>Login</b>
                  </h4>
                  <p className="grey-text text-darken-1">
                    Don't have an account?{" "}
                    <Link to="/request-access">Request Access</Link>
                  </p>
                </div>
                <form noValidate onSubmit={this.onSubmit}>
                  <CardContent
                    style={
                      isEmpty(
                        (this.props.errors && this.props.errors.data) || {}
                      )
                        ? { display: "none" }
                        : {}
                    }
                  >
                    <Alert
                      severity="error"
                      onClose={() => {
                        this.props.clearErrors();
                      }}
                    >
                      {this.props.errors &&
                        this.props.errors.data &&
                        this.props.errors.data.message}
                    </Alert>
                  </CardContent>
                  <TextField
                    onChange={this.onChange}
                    value={this.state.userName}
                    error={!!errors.userName}
                    id="userName"
                    label="Username or email"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    helperText={errors.userName}
                    InputProps={{
                      classes: {
                        input: this.props.classes.textField,
                      },
                    }}
                  />
                  <div>
                    <TextField
                      onChange={this.onChange}
                      value={this.state.password}
                      error={!!errors.password || !!errors.passwordincorrect}
                      id="password"
                      type={this.state.showPassword ? "text" : "password"}
                      label="Password"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      helperText={errors.password || errors.passwordincorrect}
                      InputProps={{
                        classes: {
                          input: this.props.classes.textField,
                        },
                      }}
                    />
                    <div
                      style={{ display: "flex", alignItems: "center" }}
                      onClick={this.toggleShowPassword}
                    >
                      <Checkbox checked={this.state.showPassword} /> Show
                      password
                    </div>
                  </div>

                  <div
                    className="col s12"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <button
                      style={{
                        width: "150px",
                        borderRadius: "3px",
                        letterSpacing: "1.5px",
                        marginTop: "1rem",
                      }}
                      type="submit"
                      className="btn waves-effect waves-light hoverable blue accent-3"
                      disabled={this.state.loading}
                    >
                      Login
                    </button>
                  </div>
                </form>
                <div
                  className="col s12"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <Link to="/forgot"> Forgotten Password?</Link>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </AlertMinimal>
    );
  }
}
Login.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  location: PropTypes.object,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default usersStateConnector(
  connect(mapStateToProps, { clearErrors, loginUser })(
    withStyles(styles)(Login)
  )
);
