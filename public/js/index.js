let isLoading = false;
let pageNumber = 0;
let nextPage;
let keywordValue = null;

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
      const newData = data.data;
      for (let i = 0; i < newData.length; i++) {
        const mainElement = document.getElementById("main");

        const divElement = document.createElement("a");
        divElement.setAttribute("class", "picture");
        divElement.setAttribute("href", `attraction/${newData[i].id}`);

        const placeElement = document.createElement("div");
        placeElement.setAttribute("class", "place");

        const detailElement = document.createElement("div");
        detailElement.setAttribute("class", "detail");

        const imageElement = document.createElement("img");
        imageElement.setAttribute("src", newData[i].images[0]);

        const placename = document.createElement("div");
        placename.setAttribute("class", "placename");
        const textPlace = document.createTextNode(newData[i].name);

        const mrt = document.createElement("div");
        mrt.setAttribute("class", "mrt");
        const textMRT = document.createTextNode(newData[i].mrt);

        const category = document.createElement("div");
        category.setAttribute("class", "category");
        const textCategory = document.createTextNode(newData[i].category);

        mainElement.appendChild(divElement);

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
const footer = document.querySelector("footer");

const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0,
};

function callback(entries) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    if (nextPage != null && isLoading === false) {
      loadAttractions();
    }
  }
}
const observer = new IntersectionObserver(callback, options);
observer.observe(footer);

// 搜尋 keyword
const searchKeyword = document.getElementById("searchKeyword");
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
      const countCategories = data.data.length;
      for (let j = 0; j < countCategories; j++) {
        const categoriesListElement =
          document.getElementById("categoriesList");

        const categories = document.createElement("li");
        const categoriesTitle = document.createTextNode(data.data[j]);
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
  const categoriesValue = document.getElementById("inputCategories");
  categoriesValue.value = this.textContent;
}

document.onclick = function (event) {
  const categoriesList = document.getElementById("categoriesList");
  if (event.target.id != "inputCategories") {
    categoriesList.style.display = "none";
  } else {
    categoriesList.style.display = "block";
  }
};