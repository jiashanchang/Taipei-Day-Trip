let url = location.href;
let id = url.split("/")[4];

getEachAttraction(id);

// 取得景點編號
function getEachAttraction(id) {
  let url = `/api/attraction/${id}`;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (eachData) {
      const attractionImagesElement =
        document.getElementById("attractionImages");

      for (let i = 0; i < eachData.data.images.length; i++) {
        const imageElement = document.createElement("img");
        imageElement.setAttribute("class", "eachImage");
        imageElement.setAttribute("src", eachData.data.images[i]);
        attractionImagesElement.appendChild(imageElement);

        const collectDot = document.getElementById("collectDot");
        const dotElement = document.createElement("div");
        dotElement.setAttribute("class", "dot");
        collectDot.appendChild(dotElement);
      }

      const attractionNameElement = document.getElementById("attractionName");
      const name = document.createElement("div");
      name.setAttribute("class", "name");
      const textName = document.createTextNode(eachData.data.name);
      attractionNameElement.appendChild(name);
      name.appendChild(textName);

      const attractionLocation =
        document.getElementById("attractionLocation");
      if (eachData.data.mrt !== null) {
        attractionLocation.innerHTML =
          eachData.data.category + " at " + eachData.data.mrt;
      } else {
        attractionLocation.innerHTML =
          eachData.data.category + " 附近無捷運站可到達";
      }

      const attractionDescriptionElement = document.getElementById(
        "attractionDescription"
      );
      const description = document.createElement("div");
      description.setAttribute("class", "descriptions");
      const textDescription = document.createTextNode(
        eachData.data.description
      );
      attractionDescriptionElement.appendChild(description);
      description.appendChild(textDescription);

      const attractionAddressElement =
        document.getElementById("attractionAddress");
      const address = document.createElement("div");
      address.setAttribute("class", "address");
      const textAddress = document.createTextNode(eachData.data.address);
      attractionAddressElement.appendChild(address);
      address.appendChild(textAddress);

      const attractionTransportElement = document.getElementById(
        "attractionTransport"
      );
      const transport = document.createElement("div");
      transport.setAttribute("class", "transport");
      const textTransport = document.createTextNode(eachData.data.transport);
      attractionTransportElement.appendChild(transport);
      transport.appendChild(textTransport);

      displayImages(index);
    })
    .catch(function (error) {
      const attractionMessage = document.querySelector(".attraction");
      attractionMessage.textContent = "景點編號不正確";
    });
}

// 景點圖片輪播
// 設定 index 為第一張圖片（images[0]）
// 判斷第 number 張圖片，是否超過圖片總數及 number 小於 1 的 index 值
// 再將全部 images 隱藏
// 最後判斷應該顯示的圖片（[index - 1]）
// dots 數同理
const images = document.getElementsByClassName("eachImage");
const dots = document.getElementsByClassName("dot");
let index = 1;

function displayImages(number) {
  let j;
  if (number > images.length) {
    index = 1;
  }
  if (number < 1) {
    index = images.length;
  }
  for (j = 0; j < images.length; j++) {
    images[j].style.display = "none";
  }
  for (j = 0; j < dots.length; j++) {
    dots[j].className = dots[j].className.replace("move", "");
  }

  images[index - 1].style.display = "block";
  dots[index - 1].className += " move";
}

function startClick(number) {
  displayImages((index += number));
}

// 訂購導覽時段選擇及費用
forenoonRadio.addEventListener("click", () => {
  document.getElementById("cost").innerHTML = "新台幣 2000 元";
});

afternoonRadio.addEventListener("click", () => {
  document.getElementById("cost").innerHTML = "新台幣 2500 元";
});

// 預定行程流程
const warnReservationForm = document.getElementById("warnForm");
const warnReservationMessage = document.getElementById("warn");
const reservation = document.getElementById("reservation");
reservation.addEventListener("click", () => {
  const attraction_id = window.location.pathname.split("/")[2];
  const inputDate = document.getElementById("inputDate").value;
  const choosetime = document.querySelector("input[name='time']:checked").value;
  if (choosetime == "forenoonRadio") {
    time = "早上 9 點到下午 4 點";
  } else {
    time = "下午 2 點到晚上 9 點";
  }
  const chooseprice = document.querySelector("input[name='time']:checked").value;
  if (chooseprice == "forenoonRadio") {
    price = "2000";
  } else {
    price = "2500";
  }
  fetch("/api/booking", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "attraction_id": attraction_id,
      "date": inputDate,
      "time": time,
      "price": price,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (bookingData) {
      if (bookingData.ok) {
        warnReservationForm.style.display = "block";
        warnReservationMessage.style.color = "#8ce600";
        warnReservationMessage.textContent = `${bookingData.message}`;
        setTimeout(function () {
          warnReservationForm.style.display = "none";
          window.location.href = "/booking";
        }, 2500);
      } else if (bookingData.update) {
        warnReservationForm.style.display = "block";
        warnReservationMessage.style.color = "#8ce600";
        warnReservationMessage.textContent = `${bookingData.message}`;
        setTimeout(function () {
          warnReservationForm.style.display = "none";
        }, 2500);
      } else {
        warnReservationForm.style.display = "block";
        warnReservationMessage.style.color = "red";
        warnReservationMessage.textContent = "⚠ " + `${bookingData.message}`;
        setTimeout(function () {
          warnReservationForm.style.display = "none";
        }, 2500);
      }
    });
});