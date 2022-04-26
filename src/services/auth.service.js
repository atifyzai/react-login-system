import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";
const PASS_URL = "http://localhost:8080/api/";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  forgotPassword(email) {
    return axios
      .post(PASS_URL + "password-reset/", {
        email
      })
      .then(response => {
        if (response.data) {
          console.log(response.data);
        }

        return response.data;
      });
  }

  resetPassword(token, password) {
    return axios
      .post(PASS_URL + "password-reset/" + token, {
        password
      })
      .then(response => {
        if (response.data) {
          console.log(response.data);
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }

  updateProfile(name, image, DOB, education, user_id) {
    return axios.post(API_URL + "profile", {
      name,
      image,
      DOB,
      education,
      user_id
    }).then(response => {
      if (response.data) {
        console.log(response.data);
      }

      return response.data;
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();
