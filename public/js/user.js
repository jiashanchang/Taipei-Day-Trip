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

const registerButton = document.getElementById("register");
const loginButton = document.getElementById("login");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const clickRegister = document.getElementById("clickRegister");
const clickLogin = document.getElementById("clickLogin");
const hidden = document.getElementById("hidden");

// 密碼小眼睛
const eyeCloseLoginPassword = document.getElementById("eyeCloseLoginPassword");
const eyeCloseRegisterPassword = document.getElementById("eyeCloseRegisterPassword");

// 會員跳出式登入 / 註冊視窗
function homeLogin() {
  hidden.style.display = "block";
  loginForm.style.display = "block";
  loginForm.classList.add("fadeIn");
  loginButton.disabled = true;

  clickRegister.addEventListener("click", () => {
    eyeCloseRegisterPassword.style.top = "18%";
    registerForm.style.display = "block";
    loginForm.style.display = "none";
    registerButton.disabled = true;

    clickLogin.addEventListener("click", () => {
      loginForm.classList.remove("fadeIn");
      registerForm.style.display = "none";
      loginForm.style.display = "block";
    });
  });
}

// 開啟會員登入 / 註冊視窗
const clickHomeLogin = document.querySelector(".function");
clickHomeLogin.addEventListener("click", homeLogin, false);

// 顯示 / 隱藏登入密碼
eyeCloseLoginPassword.addEventListener("click", () => {
  let inputLoginPassword = document.getElementById("loginPassword");
  if (inputLoginPassword.type === "password") {
    inputLoginPassword.type = "text";
    eyeCloseLoginPassword.setAttribute("src", "/images/icon_eyes.png");
  } else {
    inputLoginPassword.type = "password";
    eyeCloseLoginPassword.setAttribute("src", "/images/icon_eyelash.png");
  }
});

// 顯示 / 隱藏註冊密碼
eyeCloseRegisterPassword.addEventListener("click", () => {
  let inputRegisterPassword = document.getElementById("registerPassword");
  if (inputRegisterPassword.type === "password") {
    inputRegisterPassword.type = "text";
    eyeCloseRegisterPassword.setAttribute("src", "/images/icon_eyes.png");
  } else {
    inputRegisterPassword.type = "password";
    eyeCloseRegisterPassword.setAttribute("src", "/images/icon_eyelash.png");
  }
});

// 查看預定之行程
const clickSchedule = document.querySelector(".schedule");
clickSchedule.addEventListener("click", () => {
  fetch("/api/user/auth", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.data) {
        window.location.href = "/booking";
      } else {
        homeLogin();
      }
    });
});

// 關閉會員視窗
closeLogin.addEventListener("click", () => {
  loginForm.style.display = "none";
  hidden.style.display = "none";
});

closeRegister.addEventListener("click", () => {
  registerForm.style.display = "none";
  hidden.style.display = "none";
});

let checkNameInputValue;
let checkEmailInputValue;
let checkPasswordInputValue;
const registerNameMessage = document.getElementById("registerNameMessage");
const registerEmailMessage = document.getElementById("registerEmailMessage");
const registerPasswordMessage = document.getElementById("registerPasswordMessage");

// 驗證會員註冊所輸入之資料
function checkRegisterInputValue(checkRegister, type) {
  let nameRule = /^[\u4e00-\u9fa5_a-zA-Z0-9_]{6,15}$/;
  let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  let passwordRule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (type == "name") {
    if (!nameRule.test(checkRegister.value)) {
      registerNameMessage.style.display = "block";
      registerNameMessage.textContent = "⚠ 須介於 6-15 字元，可包含中、英文字母、數字或下底線";
      checkNameInputValue = false;
    } else {
      registerNameMessage.style.display = "none";
      checkNameInputValue = true;
    }
  }
  if (type == "email") {
    if (!emailRule.test(checkRegister.value)) {
      registerEmailMessage.style.display = "block";
      registerEmailMessage.textContent = "⚠ 電子信箱格式錯誤";
      checkEmailInputValue = false;
    } else {
      registerEmailMessage.style.display = "none";
      checkEmailInputValue = true;
    }
  }
  if (type == "password") {
    if (!passwordRule.test(checkRegister.value)) {
      registerPasswordMessage.style.display = "block";
      registerPasswordMessage.textContent = "⚠ 至少須 8 字元且包含一個字母及一個數字";
      checkPasswordInputValue = false;
    } else {
      registerPasswordMessage.style.display = "none";
      checkPasswordInputValue = true;
    }
  }
  if (checkNameInputValue && checkEmailInputValue && checkPasswordInputValue) {
    registerButton.disabled = false;
  } else {
    registerButton.disabled = true;
  }
}

// 註冊流程
const register = document.querySelector("#register");
register.addEventListener("click", () => {
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
      const registerBottomMessage = document.querySelector("#registerBottomMessage");
      if (userRegister.ok) {
        registerBottomMessage.style.display = "flex";
        registerBottomMessage.style.color = "#8ce600";
        registerBottomMessage.textContent = `${userRegister.message}`;
        setTimeout(function () {
          registerBottomMessage.style.display = "none";
        }, 3000);
      }
      if (userRegister.error) {
        registerBottomMessage.style.display = "flex";
        registerBottomMessage.style.color = "red";
        registerBottomMessage.textContent = `${userRegister.message}`;
        setTimeout(function () {
          registerBottomMessage.style.display = "none";
        }, 3000);
      }
    });
});

const loginEmailMessage = document.getElementById("loginEmailMessage");
const loginPasswordMessage = document.getElementById("loginPasswordMessage");

// 驗證會員登入所輸入之資料
function checkLoginInputValue(checkLogin, type) {
  let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  let passwordRule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (type == "email") {
    if (!emailRule.test(checkLogin.value)) {
      loginEmailMessage.style.display = "block";
      loginEmailMessage.textContent = "⚠ 電子信箱格式錯誤";
      checkEmailInputValue = false;
    } else {
      loginEmailMessage.style.display = "none";
      checkEmailInputValue = true;
    }
  }
  if (type == "password") {
    if (!passwordRule.test(checkLogin.value)) {
      loginPasswordMessage.style.display = "block";
      loginPasswordMessage.textContent = "⚠ 至少須 8 字元且包含一個字母及一個數字";
      checkPasswordInputValue = false;
    } else {
      loginPasswordMessage.style.display = "none";
      checkPasswordInputValue = true;
    }
  }
  if (checkEmailInputValue && checkPasswordInputValue) {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

// 登入流程
const successWarnForm = document.getElementById("warnForm");
const successWarnMessage = document.getElementById("warn");
const loginBottomMessage = document.querySelector("#loginBottomMessage");
const login = document.querySelector("#login");
login.addEventListener("click", () => {
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
      if (userLogin.ok) {
        loginForm.style.display = "none";
        successWarnForm.style.display = "block";
        successWarnMessage.style.color = "#8ce600";
        successWarnMessage.textContent = "🅥 您已成功登入";
        setTimeout(function () {
          location.reload();
        }, 2000);
      }
      if (userLogin.error) {
        loginBottomMessage.style.display = "flex";
        loginBottomMessage.style.color = "red";
        loginBottomMessage.textContent = `${userLogin.message}`;
        setTimeout(function () {
          loginBottomMessage.style.display = "none";
        }, 3000);
      }
    });
});

// 登出流程
const logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
  fetch("/api/user/auth", {
    method: "DELETE",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (userLogout) {
      if (userLogout.ok) {
        successWarnForm.style.display = "block";
        successWarnMessage.style.color = "#8ce600";
        successWarnMessage.textContent = "🅥 您已成功登出";
        setTimeout(function () {
          location.reload();
        }, 1000);
      }
    });
});