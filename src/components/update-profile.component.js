import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { Redirect } from "react-router-dom";

import AuthService from "../services/auth.service";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const vname = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The name must be between 3 and 20 characters.
      </div>
    );
  }
};

const vimage = value => {
  if (value.length < 3 || value.length > 100) {
    return (
      <div className="alert alert-danger" role="alert">
        The file must me image.
      </div>
    );
  }
};

const vdob = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        Date of Birth is invalid
      </div>
    );
  }
};

const veducation = value => {
    if (value.length < 6 || value.length > 40) {
      return (
        <div className="alert alert-danger" role="alert">
          Education is invalid
        </div>
      );
    }
  };

export default class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeImage = this.onChangeImage.bind(this);
    this.onChangeDob = this.onChangeDob.bind(this);
    this.onChangeEducation = this.onChangeEducation.bind(this);
    this.onChangeUserId = this.onChangeUserId.bind(this);

    this.state = {
      name: "",
      image: "",
      DOB: "",
      education: "",
      user_id: "",
      successful: false,
      message: "",
      redirect: null,
      userReady: false,
      currentUser: { username: "" }
    };
  }


  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  onChangeImage(e) {
    this.setState({
      image: e.target.value
    });
  }

  onChangeDob(e) {
    this.setState({
      DOB: e.target.value
    });
  }

  onChangeEducation(e) {
    this.setState({
      education: e.target.value
    });
  }

  onChangeUserId(e) {
    this.setState({
      user_id: e.target.value
    });
  }

  handleUpdateProfile(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.updateProfile(
        this.state.name,
        this.state.image,
        this.state.DOB,
        this.state.education,
        this.state.user_id
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
  }

  render() {
    if (this.state.redirect) {
        return <Redirect to={this.state.redirect} />
      }
  
      const { currentUser } = this.state;
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Form
            onSubmit={this.handleUpdateProfile}
            ref={c => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="name"
                    value={currentUser.username}
                    onChange={this.onChangeName}
                    validations={[required, vname]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dob">Date of Birth</label>
                  <Input
                    type="date"
                    className="form-control"
                    name="DOB"
                    value={this.state.DOB}
                    onChange={this.onChangeDob}
                    validations={[required, vdob]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="education">Education</label>
                  <select name="education" className="form-control" validations={[required, veducation]} onChange={this.onChangeEducation}>
                    <option value="">Select</option>
                    <option value="computer science">Computer Science</option>
                    <option value="software engineering">Software Engineering</option>
                    <option value="IT">Information and Technology</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="image">Image</label>
                  <Input
                    type="file"
                    className="form-control"
                    name="image"
                    value={this.state.image}
                    onChange={this.onChangeImage}
                    validations={[required, vimage]}
                  />
                </div>

                <div className="form-group">
                  <Input
                    type="hidden"
                    name="user_id"
                    value={currentUser.id}
                  />
                </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block">Update</button>
                </div>
              </div>
            )}

            {this.state.message && (
              <div className="form-group">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}
