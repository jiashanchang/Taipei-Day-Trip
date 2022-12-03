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
      let attractionImagesElement =
        document.getElementById("attractionImages");

      for (let i = 0; i < eachData.data.images.length; i++) {
        let imageElement = document.createElement("img");
        imageElement.setAttribute("class", "eachImage");
        imageElement.setAttribute("src", eachData.data.images[i]);
        attractionImagesElement.appendChild(imageElement);

        let collectDot = document.getElementById("collectDot");
        let dotElement = document.createElement("div");
        dotElement.setAttribute("class", "dot");
        collectDot.appendChild(dotElement);
      }

      let attractionNameElement = document.getElementById("attractionName");
      let name = document.createElement("div");
      name.setAttribute("class", "name");
      let textName = document.createTextNode(eachData.data.name);
      attractionNameElement.appendChild(name);
      name.appendChild(textName);

      let attractionLocation =
        document.getElementById("attractionLocation");
      if (eachData.data.mrt !== null) {
        attractionLocation.innerHTML =
          eachData.data.category + " at " + eachData.data.mrt;
      } else {
        attractionLocation.innerHTML =
          eachData.data.category + " 附近無捷運站可到達";
      }

      let attractionDescriptionElement = document.getElementById(
        "attractionDescription"
      );
      let description = document.createElement("div");
      description.setAttribute("class", "descriptions");
      let textDescription = document.createTextNode(
        eachData.data.description
      );
      attractionDescriptionElement.appendChild(description);
      description.appendChild(textDescription);

      let attractionAddressElement =
        document.getElementById("attractionAddress");
      let address = document.createElement("div");
      address.setAttribute("class", "address");
      let textAddress = document.createTextNode(eachData.data.address);
      attractionAddressElement.appendChild(address);
      address.appendChild(textAddress);

      let attractionTransportElement = document.getElementById(
        "attractionTransport"
      );
      let transport = document.createElement("div");
      transport.setAttribute("class", "transport");
      let textTransport = document.createTextNode(eachData.data.transport);
      attractionTransportElement.appendChild(transport);
      transport.appendChild(textTransport);

      displayImages(index);
    });
}

// 景點圖片輪播
// 設定 index 為第一張圖片（images[0]）
// 判斷第 number 張圖片，是否超過圖片總數及 number 小於 1 的 index 值
// 再將全部 images 隱藏
// 最後判斷應該顯示的圖片（[index - 1]）
// dots 數同理
let images = document.getElementsByClassName("eachImage");
let dots = document.getElementsByClassName("dot");
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