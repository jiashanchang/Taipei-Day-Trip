const notification = document.getElementById("notification");
const hello = document.getElementById("hello");
const bookingName = document.getElementById("bookingName");
const bookingEmail = document.getElementById("bookingEmail");

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
        notification.style.display = "block";
        hello.textContent = `${check.data.name}`;
        bookingName.value = check.data.name;
        bookingEmail.value = check.data.email;
        checkBooking();
      } else {
        window.location.href = "/";
      }
    });
}

checkMember();

const attractionImage = document.getElementById("attractionImage");
const taipeiTitle = document.getElementById("taipeiTitle");
const travelDate = document.getElementById("travelDate");
const travelTime = document.getElementById("travelTime");
const travelFee = document.getElementById("travelFee");
const travelLocation = document.getElementById("travelLocation");
const totalPrice = document.getElementById("totalPrice");
const noReservation = document.getElementById("noReservation");
const openReservation = document.getElementById("openReservation");

// 確認有無預定行程
function checkBooking() {
  fetch("/api/booking", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (bookingING) {
      if (bookingING.data != null) {
        openReservation.style.display = "block";
        noReservation.style.display = "none";
        attractionImage.src = bookingING.data.attraction.images;
        taipeiTitle.textContent = `${bookingING.data.attraction.name}`;
        travelDate.textContent = `${bookingING.data.date}`;
        travelTime.textContent = `${bookingING.data.time}`;
        travelFee.textContent = "新台幣 " + `${bookingING.data.price}` + " 元";
        travelLocation.textContent = `${bookingING.data.attraction.address}`;
        totalPrice.textContent = "總價：新台幣 " + `${bookingING.data.price}` + " 元";
      } else {
        openReservation.style.display = "none";
        noReservation.style.display = "block";
      }
    });
}

const deleteWarnForm = document.getElementById("warnForm");
const deleteWarnMessage = document.getElementById("warn");
const cancelDelete = document.getElementById("cancelDelete");
const deleteButton = document.getElementById("deleteButton")

// 刪除行程前提醒
const garbageCan = document.getElementById("garbageCan");
garbageCan.addEventListener("click", () => {
  deleteWarnForm.style.display = "block";
  deleteWarnMessage.style.color = "red";

  cancelDelete.addEventListener("click", () => {
    deleteWarnForm.style.display = "none";
  });
});

// 刪除預定行程
const confirmDelete = document.querySelector("#confirmDelete");
confirmDelete.addEventListener("click", () => {
  fetch("/api/booking", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (deleteBooking) {
      if (deleteBooking.ok) {
        deleteButton.style.display = "none";
        deleteWarnForm.style.display = "block";
        deleteWarnMessage.style.color = "#8ce600";
        deleteWarnMessage.textContent = `${deleteBooking.message}`;
        setTimeout(function () {
          location.reload();
        }, 2000);
      } else {
        window.location.href = "/";
      }
    });
});