const dear = document.querySelector(".dear");

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
        dear.textContent = `${check.data.name}`;
        getPastOrders();
      } else {
        window.location.href = "/";
      }
    });
}

checkMember();

const pastOrdersList = document.querySelector(".pastOrdersList");
const showPastOrderList = document.querySelector(".showPastOrderList");

// 歷史訂單
function getPastOrders() {
  fetch("/api/past_order", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (pastOrders) {
      if (pastOrders.data != null) {
        pastOrdersList.style.display = "block";
        for (let i = 0; i < pastOrders.data.length; i++) {
          const number = document.createElement("div");
          number.setAttribute("class", "number");

          const blockOrder = document.createElement("div");
          blockOrder.setAttribute("class", "blockOrder");

          const blockAttraction = document.createElement("div");
          blockAttraction.setAttribute("class", "blockAttraction");

          const blockDate = document.createElement("div");
          blockDate.setAttribute("class", "blockDate");

          const blockTime = document.createElement("div");
          blockTime.setAttribute("class", "blockTime");

          const blockName = document.createElement("div");
          blockName.setAttribute("class", "blockName");

          const blockPhone = document.createElement("div");
          blockPhone.setAttribute("class", "blockPhone");

          const textOrder = document.createElement("span");
          textOrder.setAttribute("class", "textTitle");
          const wordOrder = document.createTextNode("訂單編號：");

          const textAttraction = document.createElement("span");
          textAttraction.setAttribute("class", "textTitle");
          const wordAttraction = document.createTextNode("景點名稱：");

          const textDate = document.createElement("span");
          textDate.setAttribute("class", "textTitle");
          const wordDate = document.createTextNode("導覽日期：");

          const textTime = document.createElement("span");
          textTime.setAttribute("class", "textTitle");
          const wordTime = document.createTextNode("導覽時間：");

          const textName = document.createElement("span");
          textName.setAttribute("class", "textTitle");
          const wordName = document.createTextNode("聯絡人：");

          const textPhone = document.createElement("span");
          textPhone.setAttribute("class", "textTitle");
          const wordPhone = document.createTextNode("聯絡電話：");

          const orderNumberElement = document.createElement("span");
          orderNumberElement.setAttribute("class", "orderNumber");
          const textOrderNumber = document.createTextNode(pastOrders.data[i].order_number);

          const attractionNameElement = document.createElement("span");
          attractionNameElement.setAttribute("class", "attractionName");
          const textAttractionName = document.createTextNode(pastOrders.data[i].attraction_name);

          const aElement = document.createElement("a");
          aElement.setAttribute("class", "goAttraction");
          aElement.setAttribute("href", `attraction/${pastOrders.data[i].attraction_id}`);

          const attractionButton = document.createElement("button");
          attractionButton.setAttribute("class", "attractionButton");
          const testButton = document.createTextNode("再次訂購");

          const orderDateElement = document.createElement("span");
          orderDateElement.setAttribute("class", "orderDate");
          const textOrderDate = document.createTextNode(pastOrders.data[i].order_date);

          const orderTimeElement = document.createElement("span");
          orderTimeElement.setAttribute("class", "orderTime");
          const textOrderTime = document.createTextNode(pastOrders.data[i].order_time);

          const contactNameElement = document.createElement("span");
          contactNameElement.setAttribute("class", "contactName");
          const textContactName = document.createTextNode(pastOrders.data[i].contact_name);

          const contactPhoneElement = document.createElement("span");
          contactPhoneElement.setAttribute("class", "contactPhone");
          const textContactPhone = document.createTextNode(pastOrders.data[i].contact_phone);

          showPastOrderList.appendChild(number);

          number.appendChild(blockOrder);
          blockOrder.appendChild(textOrder);
          textOrder.appendChild(wordOrder);
          blockOrder.appendChild(orderNumberElement);
          orderNumberElement.appendChild(textOrderNumber);

          number.appendChild(blockAttraction);
          blockAttraction.appendChild(textAttraction);
          textAttraction.appendChild(wordAttraction);
          blockAttraction.appendChild(attractionNameElement);
          attractionNameElement.appendChild(textAttractionName);

          blockAttraction.appendChild(aElement);
          aElement.appendChild(attractionButton);
          attractionButton.appendChild(testButton);

          number.appendChild(blockDate);
          blockDate.appendChild(textDate);
          textDate.appendChild(wordDate);
          blockDate.appendChild(orderDateElement);
          orderDateElement.appendChild(textOrderDate);

          number.appendChild(blockTime);
          blockTime.appendChild(textTime);
          textTime.appendChild(wordTime);
          blockTime.appendChild(orderTimeElement);
          orderTimeElement.appendChild(textOrderTime);

          number.appendChild(blockName);
          blockName.appendChild(textName);
          textName.appendChild(wordName);
          blockName.appendChild(contactNameElement);
          contactNameElement.appendChild(textContactName);

          number.appendChild(blockPhone);
          blockPhone.appendChild(textPhone);
          textPhone.appendChild(wordPhone);
          blockPhone.appendChild(contactPhoneElement);
          contactPhoneElement.appendChild(textContactPhone);
        }
      } else {
        pastOrdersList.style.display = "block";
        showPastOrderList.textContent = `${pastOrders.message}`;
      }
    });
}