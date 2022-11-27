let isLoading = false;
let nextPage;
let keywordValue;

pageFetch(0);
searchCategories();

// 頁面捲動到底後自動載入後續頁面
let footer = document.querySelector("footer");

let options = {
  root: null,
  rootMargin: "0px",
  threshold: 0,
};

function callback(entries) {
  let [entry] = entries;
  if (entry.isIntersecting) {
    if (nextPage != null && isLoading === false) {
      if (keywordValue == null) {
        let url = `/api/attractions?page=${nextPage}`;
        fetch(url)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            loadAttractions(data);
            nextPage = data.nextPage;
          });
      } else {
        let url = `/api/attractions?page=${nextPage}&keyword=${keywordValue}`;
        fetch(url)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            if (data.data.length == 0) {
              document.querySelector("#main").innerHTML =
                "查無相關景點資料";
            }
            loadAttractions(data);
            nextPage = data.nextPage;
          });
      }
    }
  }
}

let observer = new IntersectionObserver(callback, options);
observer.observe(footer);

// page 連線
function pageFetch(pageNumber) {
  let url = "/api/attractions?page=" + pageNumber;
  isLoading = true;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      loadAttractions(data);
      nextPage = data.nextPage;
    });
  isLoading = false;
}

// 搜尋 keyword
let searchKeyword = document.getElementById("searchKeyword");
searchKeyword.addEventListener("click", function () {
  keywordValue = document.getElementById("inputCategories").value;
  let url = "api/attractions?page=0&keyword=" + keywordValue;
  document.querySelector("#main").innerHTML = "";
  isLoading = true;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.data.length == 0) {
        document.querySelector("#main").innerHTML = "查無相關景點資料";
      }
      loadAttractions(data);
      nextPage = data.nextPage;
    });
  isLoading = false;
});

// 載入景點資料
function loadAttractions(data) {
  let newData = data.data;
  for (let i = 0; i < newData.length; i++) {
    let mainElement = document.getElementById("main");

    let divElement = document.createElement("div");
    divElement.setAttribute("class", "picture");

    let placeElement = document.createElement("div");
    placeElement.setAttribute("class", "place");

    let detailElement = document.createElement("div");
    detailElement.setAttribute("class", "detail");

    let imageElement = document.createElement("img");
    imageElement.setAttribute("src", newData[i].images[0]);
    divElement.appendChild(imageElement);

    let placename = document.createElement("div");
    let textPlace = document.createTextNode(newData[i].name);
    placename.setAttribute("class", "placename");

    let mrt = document.createElement("div");
    let textMRT = document.createTextNode(newData[i].mrt);
    mrt.setAttribute("class", "mrt");

    let category = document.createElement("div");
    let textCategory = document.createTextNode(newData[i].category);
    category.setAttribute("class", "category");

    mainElement.appendChild(divElement);

    divElement.appendChild(placeElement);
    placeElement.appendChild(placename);
    placename.appendChild(textPlace);

    divElement.appendChild(detailElement);
    detailElement.appendChild(mrt);
    mrt.appendChild(textMRT);
    detailElement.appendChild(category);
    category.appendChild(textCategory);
  }
}

// 查詢景點分類
function searchCategories() {
  isLoading = true;
  fetch("api/categories")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let countCategories = data.data.length;
      for (i = 0; i < countCategories; i++) {
        let categoriesListElement =
          document.getElementById("categoriesList");

        let categories = document.createElement("li");
        let categoriesTitle = document.createTextNode(data.data[i]);
        categories.setAttribute("class", "categories");

        categories.appendChild(categoriesTitle);
        categories.addEventListener("click", chooseCategories);
        categoriesListElement.appendChild(categories);
      }
      isLoading = false;
    });
}

// 選擇景點分類
function chooseCategories() {
  let categoriesValue = document.getElementById("inputCategories");
  categoriesValue.value = this.textContent;
}

document.onclick = function (event) {
  let categoriesList = document.getElementById("categoriesList");
  if (event.target.id != "inputCategories") {
    categoriesList.style.display = "none";
  } else {
    categoriesList.style.display = "block";
  }
};