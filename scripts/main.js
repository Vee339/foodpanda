var apiKey = "eaeae7e95a454bcea769752daf87236c";

window.onload = loadPage;
function loadPage() {
  // selecting the elements from the document
  var mainSection = document.querySelector("main");
  var searchForm = document.forms.search_form;
  var searchBar = document.getElementById("search");
  var dietBtns = document.querySelectorAll(".dietBtn");
  var timeBtns = document.querySelectorAll(".timeBtn");

  /* Selecting displayed elements of the recipes */
  var recipesContainer = document.querySelector(".recipes-container");
  var recipeHeading = document.querySelector("#results h1");
  var querySpan = document.querySelector("#results h1 span");
  var resultsCount = document.querySelector(".results-count span");

  /* Selecting the diet type */
  for (var i = 0; i < dietBtns.length; i++) {
    dietBtns[i].onclick = function () {
      for (var j = 0; j < dietBtns.length; j++) {
        dietBtns[j].classList.remove("selected");
        dietBtns[j].classList.add("not-selected");
      }
      this.classList.remove("not-selected");
      this.classList.add("selected");
    };
  }

  /* Selecting the time */
  for (var i = 0; i < timeBtns.length; i++) {
    timeBtns[i].onclick = function () {
      for (var j = 0; j < timeBtns.length; j++) {
        timeBtns[j].classList.remove("selected");
      }
      this.classList.add("selected");
    };
  }

  searchForm.onsubmit = doSearch;

  function doSearch(e) {
    e.preventDefault();
    var searchedQuery = searchBar.value;
    var dietType = document.querySelector(".dietBtn.selected");
    var time = document.querySelector(".timeBtn.selected");

    if (dietType && time) {
      var url = `https://api.spoonacular.com/recipes/complexSearch?query=${searchedQuery}&diet=${dietType.value}&maxReadyTime=${time.value}&apiKey=${apiKey}`;
    } else if (dietType && !time) {
      var url = `https://api.spoonacular.com/recipes/complexSearch?query=${searchedQuery}&diet=${dietType.value}&apiKey=${apiKey}`;
    } else if (!dietType && time) {
      var url = `https://api.spoonacular.com/recipes/complexSearch?query=${searchedQuery}&maxReadyTime=${time.value}&apiKey=${apiKey}`;
    } else {
      var url = `https://api.spoonacular.com/recipes/complexSearch?query=${searchedQuery}&apiKey=${apiKey}`;
    }

    recipeHeading.innerHTML = `Showing results for "<span>${searchedQuery}</span>"`;
    mainSection.classList.add("active");
    recipesContainer.innerHTML = "";
    try {
      fetch(url)
        .then(function (response) {
          if (!response.ok) {
            throw new Error(`An error occured: ${response.status}`);
          }
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          var results = data.results;
          var resultNums = data.totalResults;
          //   console.log(results);
          resultsCount.innerHTML = resultNums;
          /* Throwing an error if the recipes for the searched term are unavailable */
          if (data.results < 1) {
            recipeHeading.innerHTML = `Could not find any results for "${searchedQuery}"`;
            recipesContainer.innerHTML = "";
          } else {
            for (var i = 0; i < 8; i++) {
              var result = results[i];
              var title = result.title;
              var imageSrc = result.image;
              var item = `<div class="item">
                <div class="imgBox">
                  <img src="${imageSrc}" alt="" />
                </div>
                <div class="recipe-information">
                  <h2 class="recipe-name">${title}</h2>
                  <div class="nav-buttons">
                      <button class="addRecipe">Add to my list</button>
                      <button class="makeDish">Try this!</button>
                  </div>
                </div>
              </div>`;
              recipesContainer.innerHTML += item;
            }
          }

          /* Creating the items to add in html */
        });
    } catch (error) {
      console.log("Failed to fetch data", error);
    }

    // console.log(results);
  }
}
