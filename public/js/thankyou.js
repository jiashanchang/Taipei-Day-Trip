let url = location.href;
let orderNumber = url.split("=")[1];
const notice = document.querySelector(".notice");
const follow = document.querySelector(".follow");
const transactionNumber = document.querySelector(".transactionNumber");
function getOrder() {
  fetch(`/api/order/${orderNumber}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (check) {
      if (check.data == null) {
        notice.style.display = "block";
        follow.textContent = `${check.message}`;
      }
      if (check.data != null) {
        notice.style.display = "block";
        transactionNumber.textContent = `${check.data.number}`;
      }
      if (check.error) {
        window.location.href = "/";
      }
    });
}

getOrder();