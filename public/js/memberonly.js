// 取得會員大頭貼
function getHeadshot() {
  fetch("api/member/headshot", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (getPhoto) {
      if (getPhoto.data != null) {
        let photo = getPhoto.data;
        headshot.src = photo;
      }
    });
}

const nowName = document.querySelector(".nowName");
const nowEmail = document.querySelector(".nowEmail");
const userData = document.querySelector(".userData");
const newName = document.getElementById("newName");

// 檢查會員登入狀態
function checkMember() {
  fetch("/api/user/auth", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (check) {
      if (check.data) {
        getHeadshot();
        userData.style.display = "block";
        nowName.textContent = `${check.data.name}`;
        nowEmail.textContent = `${check.data.email}`;
      } else {
        window.location.href = "/";
      }
    });
}

checkMember();

// 顯示頭貼
const headshot = document.querySelector(".headshot");
const showPhoto = document.getElementById("choosePhoto");
showPhoto.addEventListener("change", function (event) {
  headshot.src = URL.createObjectURL(event.target.files[0]);
});

// 上傳頭貼
const uploadForm = document.getElementById("warnForm");
const uploadMessage = document.getElementById("warn");
const confirmUpload = document.querySelector(".confirmUpload");
confirmUpload.addEventListener("click", () => {
  const choosePhoto = document.getElementById("choosePhoto").files[0];
  let formData = new FormData();
  formData.append("headshot", choosePhoto);
  fetch("api/member/headshot", {
    method: "POST",
    body: formData,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (upload) {
      if (upload.ok) {
        uploadForm.style.display = "block";
        uploadMessage.style.color = "#8ce600";
        uploadMessage.textContent = "🅥 " + `${upload.message}`;
        setTimeout(function () {
          uploadForm.style.display = "none";
        }, 1500);
      } else {
        uploadForm.style.display = "block";
        uploadMessage.style.color = "red";
        uploadMessage.textContent = "⚠ " + `${upload.message}`;
        setTimeout(function () {
          uploadForm.style.display = "none";
        }, 1500);
      }
    });
});

const saveUpdateName = document.getElementById("saveUpdateName");
const confirmUpdateName = document.getElementById("confirmUpdateName");
confirmUpdateName.addEventListener("click", () => {
  confirmUpdateName.style.display = "none";
  newName.style.display = "block";
  nowName.style.display = "none";
  saveUpdateName.style.display = "block";
});

// 變更會員姓名
saveUpdateName.addEventListener("click", () => {
  fetch("/api/member/name", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "newname": newName.value,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (updateMemberName) {
      if (updateMemberName.ok) {
        saveUpdateName.style.display = "none";
        confirmUpdateName.style.display = "block";
        uploadForm.style.display = "block";
        uploadMessage.style.color = "#8ce600";
        uploadMessage.textContent = "🅥 姓名更新成功";
        setTimeout(function () {
          uploadForm.style.display = "none";
          window.location.reload();
        }, 1500);
      } else {
        uploadForm.style.display = "block";
        uploadMessage.style.color = "red";
        uploadMessage.textContent = "⚠ " + `${updateMemberName.message}`;
        setTimeout(function () {
          uploadForm.style.display = "none";
        }, 1500);
      }
    });
});

// 變更會員密碼
let pastPasswordInputValue;
let newPasswordInputValue;
let newPasswordAgainInputValue;
let passwordRule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const pastPasswordMessage = document.querySelector(".pastPasswordMessage");
const newPasswordMessage = document.querySelector(".newPasswordMessage");
const newPasswordAgainMessage = document.querySelector(".newPasswordAgainMessage");

const pastPassword = document.getElementById("pastPassword");
const newPassword = document.getElementById("newPassword");
const newPasswordAgain = document.getElementById("newPasswordAgain");
const saveUpdatePassword = document.getElementById("saveUpdatePassword");

pastPassword.addEventListener("input", () => {
  if (pastPassword.value == "") {
    pastPasswordMessage.textContent = "⚠ 必填欄位";
    pastPasswordInputValue = false;
  } else if (!passwordRule.test(pastPassword.value)) {
    pastPasswordMessage.textContent = "⚠ 密碼格式錯誤";
    pastPasswordInputValue = false;
  } else {
    pastPasswordMessage.textContent = "";
    pastPasswordInputValue = true;
  }
});

newPassword.addEventListener("input", () => {
  if (newPassword.value == "") {
    newPasswordMessage.textContent = "⚠ 必填欄位";
    newPasswordInputValue = false;
  } else if (!passwordRule.test(newPassword.value)) {
    newPasswordMessage.textContent = "⚠ 至少須 8 字元且包含一個字母及一個數字";
    newPasswordInputValue = false;
  } else {
    newPasswordMessage.textContent = "";
    newPasswordInputValue = true;
  }
});

newPasswordAgain.addEventListener("input", () => {
  if (newPasswordAgain.value == "") {
    newPasswordAgainMessage.textContent = "⚠ 必填欄位";
    newPasswordAgainInputValue = false;
  } else if (!passwordRule.test(newPasswordAgain.value)) {
    newPasswordAgainMessage.textContent = "⚠ 至少須 8 字元且包含一個字母及一個數字";
    newPasswordAgainInputValue = false;
  } else {
    newPasswordAgainMessage.textContent = "";
    newPasswordAgainInputValue = true;
  }
});

saveUpdatePassword.addEventListener("click", () => {
  if (pastPasswordInputValue && newPasswordInputValue && newPasswordAgainInputValue) {
    if (newPassword.value === newPasswordAgain.value) {
      fetch("/api/member/password", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "past_password": pastPassword.value,
          "new_password": newPassword.value,
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (updateMemberPassword) {
          if (updateMemberPassword.ok) {
            uploadForm.style.display = "block";
            uploadMessage.style.color = "#8ce600";
            uploadMessage.textContent = "🅥 " + `${updateMemberPassword.message}`;
            setTimeout(function () {
              uploadForm.style.display = "none";
              window.location.reload();
            }, 1500);
          }
          if (updateMemberPassword.error) {
            uploadForm.style.display = "block";
            uploadMessage.style.color = "red";
            uploadMessage.textContent = "⚠ " + `${updateMemberPassword.message}`;
            setTimeout(function () {
              uploadForm.style.display = "none";
            }, 1500);
          }
        });
    } else {
      uploadForm.style.display = "block";
      uploadMessage.style.color = "red";
      uploadMessage.textContent = "⚠ 密碼輸入錯誤";
      setTimeout(function () {
        uploadForm.style.display = "none";
      }, 1500);
    }
  } else {
    uploadForm.style.display = "block";
    uploadMessage.style.color = "red";
    uploadMessage.textContent = "⚠ 密碼輸入錯誤";
    setTimeout(function () {
      uploadForm.style.display = "none";
    }, 1500);
  }
});