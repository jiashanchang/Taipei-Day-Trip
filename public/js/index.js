let isLoading = false;
let pageNumber = 0;
let nextPage;
let keywordValue = null;
let id = 1;

loadAttractions();
searchCategories();

// 載入景點資料
function loadAttractions() {
  let url = `/api/attractions?page=${pageNumber}`;
  if (keywordValue != null) {
    url += `&keyword=${keywordValue}`;
  }
  isLoading = true;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      nextPage = data.nextPage;
      pageNumber = nextPage;
      let newData = data.data;
      for (let i = 0; i < newData.length; i++) {
        let mainElement = document.getElementById("main");

        let aElement = document.createElement("a");
        aElement.setAttribute("href", `/attraction/${id}`);
        id += 1;

        let divElement = document.createElement("div");
        divElement.setAttribute("class", "picture");

        let placeElement = document.createElement("div");
        placeElement.setAttribute("class", "place");

        let detailElement = document.createElement("div");
        detailElement.setAttribute("class", "detail");

        let imageElement = document.createElement("img");
        imageElement.setAttribute("src", newData[i].images[0]);

        let placename = document.createElement("div");
        placename.setAttribute("class", "placename");
        let textPlace = document.createTextNode(newData[i].name);

        let mrt = document.createElement("div");
        mrt.setAttribute("class", "mrt");
        let textMRT = document.createTextNode(newData[i].mrt);

        let category = document.createElement("div");
        category.setAttribute("class", "category");
        let textCategory = document.createTextNode(newData[i].category);

        mainElement.appendChild(aElement);

        aElement.appendChild(divElement);

        divElement.appendChild(imageElement);

        divElement.appendChild(placeElement);
        placeElement.appendChild(placename);
        placename.appendChild(textPlace);

        divElement.appendChild(detailElement);
        detailElement.appendChild(mrt);
        mrt.appendChild(textMRT);
        detailElement.appendChild(category);
        category.appendChild(textCategory);
      }
      if (data.data.length === 0) {
        document.querySelector("#main").innerHTML = "查無相關景點資料";
      }
      isLoading = false;
    });
}

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
      loadAttractions();
    }
  }
}
let observer = new IntersectionObserver(callback, options);
observer.observe(footer);

// 搜尋 keyword
let searchKeyword = document.getElementById("searchKeyword");
searchKeyword.addEventListener("click", function () {
  pageNumber = 0;
  keywordValue = document.getElementById("inputCategories").value;
  document.querySelector("#main").innerHTML = "";
  loadAttractions();
});

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