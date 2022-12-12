// 檢查會員登入狀態
const checkLogin = document.querySelector(".function");
const checkLogout = document.querySelector(".logout");
window.onload = function () {
  fetch("/api/user/auth", { method: "GET" })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.data) {
        checkLogin.style.display = "none";
        checkLogout.style.display = "block";
      } else {
        checkLogin.style.display = "block";
        checkLogout.style.display = "none";
      }
    });
};

// 跳出式登入 / 註冊視窗
function homeLogin() {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const clickRegister = document.getElementById("clickRegister");
  const clickLogin = document.getElementById("clickLogin");
  const hidden = document.getElementById("hidden");

  hidden.style.display = "block";
  loginForm.style.display = "block";
  clickRegister.addEventListener("click", () => {
    registerForm.style.display = "block";
    loginForm.style.display = "none";
    clickLogin.addEventListener("click", () => {
      registerForm.style.display = "none";
      loginForm.style.display = "block";
    });
  });
}

closeLogin.addEventListener("click", () => {
  loginForm.style.display = "none";
  hidden.style.display = "none";
});

closeRegister.addEventListener("click", () => {
  registerForm.style.display = "none";
  hidden.style.display = "none";
});

// 註冊流程
function startRegister() {
  const registerName = document.getElementById("registerName").value;
  const registerEmail = document.getElementById("registerEmail").value;
  const registerPassword = document.getElementById("registerPassword").value;

  fetch("/api/user", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "name": registerName,
      "email": registerEmail,
      "password": registerPassword,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (userRegister) {
      const registerMessage = document.querySelector("#registerMessage");
      if (userRegister.ok) {
        registerMessage.style.color = "#8ce600";
        registerMessage.textContent = `${userRegister.message}`;
        if ((registerMessage.style.display = "flex")) {
          setTimeout(function () {
            registerMessage.style.display = "none";
          }, 3000);
        }
      }
      if (userRegister.error) {
        registerMessage.style.color = "red";
        registerMessage.textContent = `${userRegister.message}`;
        if ((registerMessage.style.display = "flex")) {
          setTimeout(function () {
            registerMessage.style.display = "none";
          }, 3000);
        }
      }
    });
}

// 登入流程
function startLogin() {
  const loginEmail = document.getElementById("loginEmail").value;
  const loginPassword = document.getElementById("loginPassword").value;

  fetch("/api/user/auth", {
    method: "PUT",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "email": loginEmail,
      "password": loginPassword,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (userLogin) {
      const loginMessage = document.querySelector("#loginMessage");
      if (userLogin.ok) {
        location.reload();
      }
      if (userLogin.error) {
        loginMessage.style.color = "red";
        loginMessage.textContent = `${userLogin.message}`;
        if ((loginMessage.style.display = "flex")) {
          setTimeout(function () {
            loginMessage.style.display = "none";
          }, 3000);
        }
      }
    });
}

// 登出流程
function startLogout() {
  fetch("/api/user/auth", {
    method: "DELETE",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (userLogout) {
      if (userLogout.ok) {
        location.reload();
      }
    });
}