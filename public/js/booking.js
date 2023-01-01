const notification = document.getElementById("notification");
const hello = document.getElementById("hello");
const bookingName = document.getElementById("bookingName");
const bookingEmail = document.getElementById("bookingEmail");
const bookingCellphonedNumber = document.getElementById("bookingCellphonedNumber");

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
const bookingTitle = document.querySelector("title");
const goHome = document.getElementById("goHome");
const travelItinerary = document.getElementById("travelItinerary");

let orderAttractionId;
let orderAttractionName;
let orderAttractionAddress;
let orderAttractionImage;
let orderFee;
let orderDate;
let orderTime;

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
        orderAttractionId = bookingING.data.attraction.id;
        orderAttractionName = bookingING.data.attraction.name;
        orderAttractionAddress = bookingING.data.attraction.address;
        orderAttractionImage = bookingING.data.attraction.images;
        orderFee = bookingING.data.price;
        orderDate = bookingING.data.date;
        orderTime = bookingING.data.time;
        openReservation.style.display = "block";
        noReservation.style.display = "none";
        attractionImage.src = orderAttractionImage;
        taipeiTitle.textContent = orderAttractionName;
        travelDate.textContent = orderDate;
        travelTime.textContent = orderTime;
        travelFee.textContent = "新台幣 " + orderFee + " 元";
        travelLocation.textContent = orderAttractionAddress;
        totalPrice.textContent = "總價：新台幣 " + orderFee + " 元";
        bookingTitle.textContent = "預定行程 - " + orderAttractionName;
      } else {
        travelItinerary.style.marginBottom = "120px";
        openReservation.style.display = "none";
        goHome.style.display = "block";
        noReservation.style.display = "block";
        bookingTitle.textContent = "預定行程 - 暫無預定行程";
      }
    });
}

const checkWarnForm = document.getElementById("warnForm");
const checkWarnMessage = document.getElementById("warn");
const cancelDelete = document.getElementById("cancelDelete");
const deleteButton = document.getElementById("deleteButton");

// 刪除行程前提醒
const garbageCan = document.getElementById("garbageCan");
garbageCan.addEventListener("click", () => {
  checkWarnForm.style.display = "block";
  deleteButton.style.display = "flex";
  checkWarnMessage.style.color = "red";

  cancelDelete.addEventListener("click", () => {
    checkWarnForm.style.display = "none";
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
        checkWarnForm.style.display = "block";
        checkWarnMessage.style.color = "#8ce600";
        checkWarnMessage.textContent = "🅥 " + `${deleteBooking.message}`;
        setTimeout(function () {
          location.reload();
        }, 2000);
      } else {
        window.location.href = "/";
      }
    });
});

TPDirect.setupSDK(
  126859,
  "app_1IyuR25klEZke9A1745RvTKOyD9pKPm7tB5dg9cOpkHbRKdeRyzYgQdDS9zG",
  "sandbox"
);

let fields = {
  number: {
    // css selector
    element: "#card-number",
    placeholder: "**** **** **** ****",
  },
  expirationDate: {
    // DOM object
    element: document.getElementById("card-expiration-date"),
    placeholder: "MM / YY",
  },
  ccv: {
    element: "#card-ccv",
    placeholder: "CCV",
  },
};

TPDirect.card.setup({
  // Display ccv field
  fields: fields,
  styles: {
    // Style all elements
    input: {
      color: "#666666",
    },
    // Styling ccv field
    "input.ccv": {
      "font-size": "16px",
    },
    // Styling expiration-date field
    "input.expiration-date": {
      "font-size": "16px",
    },
    // Styling card-number field
    "input.card-number": {
      "font-size": "16px",
    },
    // style focus state
    ":focus": {
      color: "#666666",
    },
    // style valid state
    ".valid": {
      color: "green",
    },
    // style invalid state
    ".invalid": {
      color: "red",
    },
    // Media queries
    // Note that these apply to the iframe, not the root window.
    "@media screen and (max-width: 400px)": {
      input: {
        color: "red",
      },
    },
  },
  // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 6,
    endIndex: 11,
  },
});

let bookingNameInputValue = true;
let bookingEmailInputValue = true;
let bookingCellphonedNumberInputValue;
const bookingNameMessage = document.querySelector(".bookingNameMessage");
const bookingEmailMessage = document.querySelector(".bookingEmailMessage");
const bookingCellphonedNumberMessage = document.querySelector(".bookingCellphonedNumberMessage");
let nameRule = /^[\u4e00-\u9fa5_a-zA-Z0-9_]{5,8}$/;
let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
let phoneRule = /^09[0-9]{8}$/;

bookingName.addEventListener("input", () => {
  bookingNameInputValue = true;
  if (bookingName.value == "") {
    bookingNameMessage.textContent = "⚠ 必填欄位";
    bookingNameInputValue = false;
  } else if (!nameRule.test(bookingName.value)) {
    bookingNameMessage.textContent = "⚠ 須介於 5-8 字元，可包含中、英文字母、數字或下底線";
    bookingNameInputValue = false;
  } else {
    bookingNameMessage.textContent = "";
    bookingNameInputValue = true;
  }
});

bookingEmail.addEventListener("input", () => {
  bookingEmailInputValue = true;
  if (bookingEmail.value == "") {
    bookingEmailMessage.textContent = "⚠ 必填欄位";
    bookingEmailInputValue = false;
  } else if (!emailRule.test(bookingEmail.value)) {
    bookingEmailMessage.textContent = "⚠ 信箱格式錯誤";
    bookingEmailInputValue = false;
  } else {
    bookingEmailMessage.textContent = "";
    bookingEmailInputValue = true;
  }
});

bookingCellphonedNumber.addEventListener("input", () => {
  bookingCellphonedNumberInputValue = false;
  if (bookingCellphonedNumber.value == "") {
    bookingCellphonedNumberMessage.textContent = "⚠ 必填欄位";
    bookingCellphonedNumberInputValue = false;
  } else if (!phoneRule.test(bookingCellphonedNumber.value)) {
    bookingCellphonedNumberMessage.textContent = "⚠ 手機號碼格式錯誤";
    bookingCellphonedNumberInputValue = false;
  } else {
    bookingCellphonedNumberMessage.textContent = "";
    bookingCellphonedNumberInputValue = true;
  }
});

let prime;
const remit = document.getElementById("remit");
remit.addEventListener("click", (event) => {
  if (!bookingNameInputValue || !bookingEmailInputValue || !bookingCellphonedNumberInputValue) {
    deleteButton.style.display = "none";
    checkWarnForm.style.display = "block";
    checkWarnMessage.style.color = "red";
    checkWarnMessage.textContent = "⚠ 請完整填寫聯絡資訊";
    setTimeout(function () {
      checkWarnForm.style.display = "none";
    }, 1500);
    return;
  }

  event.preventDefault();

  // 取得 TapPay Fields 的 status
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();
  // 確認是否可以 getPrime
  if (tappayStatus.canGetPrime === false) {
    checkWarnForm.style.display = "block";
    checkWarnMessage.style.color = "red";
    checkWarnMessage.textContent = "⚠ 信用卡資料錯誤";
    setTimeout(function () {
      checkWarnForm.style.display = "none";
    }, 1500);
    return;
  }

  // Get prime
  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
      checkWarnForm.style.display = "block";
      checkWarnMessage.style.color = "red";
      checkWarnMessage.textContent = "⚠ 付款失敗";
      setTimeout(function () {
        checkWarnForm.style.display = "none";
      }, 1500);
      return;
    }
    prime = result.card.prime;

    fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        "prime": prime,
        "order": {
          "price": orderFee,
          "trip": {
            "attraction": {
              "id": orderAttractionId,
              "name": orderAttractionName,
              "address": orderAttractionAddress,
              "image": orderAttractionImage,
            },
            "date": orderDate,
            "time": orderTime,
          },
          "contact": {
            "name": bookingName.value,
            "email": bookingEmail.value,
            "phone": bookingCellphonedNumber.value,
          },
        },
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (orderData) {
        if (orderData.data.payment.status === 0) {
          window.location.href = `/thankyou?number=${orderData.data.number}`;
        } else {
          checkWarnForm.style.display = "block";
          checkWarnMessage.style.color = "red";
          checkWarnMessage.textContent = "⚠ 付款失敗";
          setTimeout(function () {
            checkWarnForm.style.display = "none";
          }, 1500);
        }
      });
    // send prime to your server, to pay with Pay by Prime API .
    // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
  });
});