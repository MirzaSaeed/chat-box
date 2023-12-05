document.getElementById(
  "navbar-brand"
).innerHTML = `Login first to start chart`;

// Check user Auth
const isAuth = JSON.parse(localStorage.getItem("auth"));
if (isAuth !== null) {
  window.location.href = "/pages/dashboard/dashboard.html";
}

const handleSignUpForm = (e) => {
  e.preventDefault();
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const gender = document.getElementById("gender").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  let userList = JSON.parse(localStorage.getItem("users")) || [];
  let existEmail;
  const existUser = userList.filter((user) => {
    if (user.email === email) {
      existEmail = user.email;
      return user;
    }
  });
  if (existEmail === email) {
    document.getElementById("alert-danger").style.display = "block";
    document.getElementById("alert-danger").innerHTML =
      "ERROR! User Already exists";
    setTimeout(() => {
      document.getElementById("alert").style.display = "none";
    }, 3000);
  } else if (existEmail !== email) {
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      gender === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      document.getElementById("alert-danger").style.display = "block";
      document.getElementById("alert-danger").innerHTML =
        "ERROR! Enter All Credentials";
      setTimeout(() => {
        document.getElementById("alert-danger").style.display = "none";
      }, 3000);
    } else if (password !== confirmPassword) {
      document.getElementById("alert-danger").style.display = "block";
      document.getElementById("alert-danger").innerHTML =
        "ERROR! Passwords do not match";
      setTimeout(() => {
        document.getElementById("alert-danger").style.display = "none";
      }, 3000);
    } else if (password === confirmPassword) {
      let user = {
        id: userList.length + 1,
        firstName: firstName,
        lastName: lastName,
        email: email,
        gender: gender,
        password: password,
        chat: [],
        createdAt: new Date(),
      };
      userList.push(user);
      localStorage.setItem("users", JSON.stringify(userList));
      document.getElementById("alert-success").style.display = "block";
      document.getElementById("alert-success").innerHTML =
        "User Registered successfully";
      setTimeout(() => {
        document.getElementById("alert-success").style.display = "none";
        window.location.href = "/login.html";
      }, 1000);
    }
  }
};

const handleLoginForm = (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (email === "" || password === "") {
    document.getElementById("alert-danger").style.display = "block";
    document.getElementById("alert-danger").innerHTML =
      "ERROR! Enter Credentials";
    setTimeout(() => {
      document.getElementById("alert-danger").style.display = "none";
    }, 3000);
  } else {
    let userList = JSON.parse(localStorage.getItem("users")) || [];
    if (userList.length > 0) {
      const existUser = userList.filter((user) => user.email === email);
      let userEmail, userPassword;
      if (existUser.length > 0) {
        const verifyUser = existUser.filter((user) => {
          if (user.email === email && user.password === password) {
            userEmail = user.email;
            userPassword = user.password;
            return user;
          }
        });
        if (email === userEmail && userPassword === password) {
          if (verifyUser.length === 0) {
            document.getElementById("alert-danger").style.display = "block";
            document.getElementById("alert-danger").innerHTML =
              "ERROR! Invalid Credentials";
            setTimeout(() => {
              document.getElementById("alert-danger").style.display = "none";
            }, 3000);
          } else {
            console.log(existUser);
            localStorage.setItem("auth", JSON.stringify(existUser[0]));
            localStorage.setItem("authSession", JSON.stringify(new Date()));
            document.getElementById("alert-success").style.display = "block";
            document.getElementById("alert-success").innerHTML =
              "User Login successfully";

            setTimeout(() => {
              document.getElementById("alert-success").style.display = "none";
              window.location.href = "/pages/dashboard/dashboard.html";
            }, 1000);
          }
        } else if (email !== userEmail || userPassword !== password) {
          document.getElementById("alert-danger").style.display = "block";
          document.getElementById("alert-danger").innerHTML =
            "ERROR! Invalid Credentials";
          setTimeout(() => {
            document.getElementById("alert-danger").style.display = "none";
          }, 3000);
        }
      } else {
        document.getElementById("alert-danger").style.display = "block";
        document.getElementById("alert-danger").innerHTML =
          "ERROR! User not found";
        setTimeout(() => {
          document.getElementById("alert-danger").style.display = "none";
        }, 3000);
      }
    } else {
      document.getElementById("alert-danger").style.display = "block";
      document.getElementById("alert-danger").innerHTML =
        "ERROR! User not found";
      setTimeout(() => {
        document.getElementById("alert-danger").style.display = "none";
      }, 3000);
    }
  }
};

// IIFE
(() => {
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
        if (document.getElementById("login-form")) {
          handleLoginForm(event);
        } else if (document.getElementById("signup-form")) {
          handleSignUpForm(event);
        }
      },
      false
    );
  });
})();
