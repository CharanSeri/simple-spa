//app is for general control over the application
//and connections between the other components
let instructions = document.querySelector("#instructions");
let actors = document.querySelector("#actors");
let media = document.querySelector("#media");
let filter = document.querySelector("#filter");
let errorMessage = document.querySelector("#errorMessage");
let loading = document.querySelector("#loadIngImg");
let filterFlagPopularity = 0;
let filterFlagName = 0;
let baseImageUrl = null;
let baseWebsiteUrl = null;
let apiData = null;
let searchTerm = null;
let searchHistory = [];
let dataFoundInLocalStorage = false;
let dataId = null;
let api_key = "3bc7d6ace3ce80689836d2664ae1b1ac";
let baseUrl = "https://api.themoviedb.org/3";

const APP = {
  init: () => {
    //this function runs when the page loads
    console.log("---> Getting Configuration", location.href);
    window.addEventListener("hashchange", NAV.hc);
    location.href = "#";
    baseWebsiteUrl = location.href;
    let form = document.querySelector("form");
    form.addEventListener("submit", SEARCH.actors);
    let configUrl = baseUrl + `/configuration?api_key=${api_key}`;
    if (localStorage.getItem("searchHistory") == null)
      STORAGE.localStorageCreate();
    else searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    fetch(configUrl)
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error(`${response.status}`);
      })
      .then((data) => {
        baseImageUrl =
          data.images.secure_base_url + data.images.profile_sizes[1];
        console.log("---> Configuration Retrieved Success!");
      })
      .catch((err) => {
        errorMessage.classList.add("active");
        console.log(err);
      });
    instructions.classList.add("active");
    actors.classList.remove("active");
    errorMessage.classList.remove("active");
  },
};

//search is for anything to do with the fetch api
const SEARCH = {
  actors: (event) => {
    console.log(event.type);
    if (event.type == "submit" || event.type == "hashchange")
      event.preventDefault();
    instructions.style.textAlign = "center";
    instructions.innerHTML = "<img src='./img/loading-buffering.gif'/>";
    searchTerm = document.getElementById("search").value;
    console.log("---> User Search Term", searchTerm);
    location.href = baseWebsiteUrl + searchTerm;
    dataFoundInLocalStorage = false;
    media.classList.remove("active");
    actors.children[1].style.display = "grid";
    console.log("---> Fetching Talent!", window.location.href);
    let url =
      baseUrl +
      `/search/person?api_key=${api_key}&language=en-US&query=${searchTerm}&page=1&include_adult=false`;
    STORAGE.localStorageGet(searchTerm);
    if (dataFoundInLocalStorage) {
      console.log("local storage-->", searchTerm);
      for (let i = 0; i < searchHistory.length; i++) {
        searchHistory[i].results[0].name.split(" ").forEach((element) => {
          if (element == searchTerm) {
            console.log("---> Returning Data From Local Storage");
            apiData = searchHistory[i];
            ACTORS.gotActors(searchHistory[i]);
          }
        });
      }
    } else {
      fetch(url)
        .then((response) => {
          if (response.ok) return response.json();
          else throw new Error(`${response.status}`);
        })
        .then((data) => {
          apiData = data;
          console.log("---> Not Found In Local Storage", data);
          STORAGE.localStorageAdd(data);
          ACTORS.gotActors(data);
        })
        .catch((err) => {
          errorMessage.classList.add("active");
          console.log(err);
        });
    }
  },
};

//actors is for changes connected to content in the actors section
const ACTORS = {
  gotActors: (data) => {
    console.log("---> Fetching Talent Success");
    console.log("---> Checking for Cards");
    if (document.querySelector(".card")) {
      console.log("---> Cards Available");
      let children = actors.children[1];
      let lastChild = children.lastElementChild;
      while (lastChild) {
        children.removeChild(lastChild);
        lastChild = children.lastElementChild;
      }
    }
    instructions.classList.remove("active");
    actors.classList.add("active");
    filter.style.display = "flex";
    filter.children[0].addEventListener("click", ACTORS.filterActorsPopularity);
    filter.children[1].addEventListener("click", ACTORS.filterActorsName);
    let actorsData = data.results;
    actorsData.forEach((element) => {
      let div = document.createElement("div");
      let img = document.createElement("img");
      let h4 = document.createElement("h4");
      let p = document.createElement("p");
      let divText = document.createElement("div");
      img.setAttribute("src", baseImageUrl + element.profile_path);
      h4.innerHTML = element.name;
      p.innerHTML = element.popularity;
      div.classList.add("card");
      divText.appendChild(h4);
      divText.appendChild(p);
      div.appendChild(img);
      div.appendChild(divText);
      let actorId = document.createAttribute("data-actorId");
      actorId.value = element.id;
      div.setAttributeNode(actorId);
      actors.children[1].style.gap = "1rem";
      actors.children[1].appendChild(div);
      var cards = document.getElementsByClassName("card");
      for (var i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", MEDIA.actorInfo);
      }
    });
    console.log("---> No Cards Available");
    console.log("---> Talent displayed Successfully");
    console.log("---> Click On image For Additional Info");
  },
  filterActorsPopularity: () => {
    dataFoundInLocalStorage = true;
    if (!filterFlagPopularity) {
      console.log("---> Filtering Data Ascending");
      filterFlagPopularity = 1;
      let tempData = apiData;
      tempData.results.sort((a, b) => {
        return a.popularity < b.popularity ? -1 : 1;
      });
      SEARCH.actors(tempData);
    } else {
      console.log("---> Filtering Data Descending");
      filterFlagPopularity = 0;
      let tempData = apiData;
      tempData.results.sort((a, b) => {
        return a.popularity > b.popularity ? -1 : 1;
      });
      SEARCH.actors(tempData);
    }
  },
  filterActorsName: () => {
    dataFoundInLocalStorage = true;
    if (!filterFlagName) {
      console.log("---> Filtering Data Ascending");
      filterFlagName = 1;
      let tempData = apiData;
      tempData.results.sort((a, b) => {
        return a.name < b.name ? -1 : 1;
      });
      SEARCH.actors(tempData);
    } else {
      console.log("---> Filtering Data Descending");
      filterFlagName = 0;
      let tempData = apiData;
      tempData.results.sort((a, b) => {
        return a.name > b.name ? -1 : 1;
      });
      SEARCH.actors(tempData);
    }
  },
};

//media is for changes connected to content in the media section
const MEDIA = {
  actorInfo: (event) => {
    let children = media.children[1];
    let lastChild = children.lastElementChild;
    while (lastChild) {
      children.removeChild(lastChild);
      lastChild = children.lastElementChild;
    }
    media.classList.add("active");
    actors.children[1].style.display = "none";
    actors.children[0].addEventListener("click", SEARCH.actors);
    let selectedActorID =
      event.target.parentElement.getAttribute("data-actorId");
    history.replaceState(
      {},
      searchTerm,
      baseWebsiteUrl + location.hash + "/" + selectedActorID
    );

    console.log("--> Getting Talent Details", selectedActorID);
    let actor = apiData.results.filter(
      (element) => element.id == selectedActorID
    );
    actor[0].known_for.forEach((element) => {
      let div = document.createElement("div");
      div.style.display = "flex";
      div.style.flexWrap = "wrap";
      div.style.flexDirection = "Column";
      let card = document.createElement("div");
      let img = document.createElement("img");
      let h4 = document.createElement("h4");
      let p = document.createElement("p");
      let divText = document.createElement("div");
      img.setAttribute("src", baseImageUrl + element.poster_path);
      h4.innerHTML = element.original_title;
      p.innerHTML = element.release_date;
      card.classList.add("card");
      divText.appendChild(h4);
      divText.appendChild(p);
      card.appendChild(img);
      card.appendChild(divText);
      div.appendChild(card);
      media.children[1].appendChild(div);
    });
    console.log("--> Retrived Talent Details");
  },
};

//storage is for working with previous Data
const STORAGE = {
  //this will be used in Assign 4
  localStorageAdd: (pushData) => {
    console.log("---> Adding IN LocalStorage");
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    console.log("--->", searchHistory);
    searchHistory.push(pushData);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  },
  localStorageCreate: () => {
    console.log("---> Creating LocalStorage");
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  },
  localStorageGet: (searchQuery) => {
    console.log("---> Looking in LocalStorage", searchHistory, searchTerm);
    if (searchHistory != null) {
      for (let i = 0; i < searchHistory.length; i++) {
        let results = searchHistory[i].results;
        results.forEach((result) => {
          let splited = result.name.split(" ");
          splited.forEach((split) => {
            if (split.includes(searchQuery)) {
              dataFoundInLocalStorage = true;
            }
          });
        });
      }
      console.log("---> Looking in LocalStorage", dataFoundInLocalStorage);
    } else {
      console.log("---> LocalStorage Is Empty");
    }
  },
};

//nav is for anything connected to the history api and location
const NAV = {
  //this will be used in Assign 4
  hc: (ev) => {
    if (searchTerm == "" || searchTerm == null) {
      location.popstate();
      APP.init();
    }
    document.getElementById("search").value = location.href.split("#")[1];
    searchTerm = location.href.split("#")[1];
    console.log("Called", location.href.split("#").length, searchTerm);
    location.href = "#" + searchTerm;
    console.log("Hash event", searchTerm);
    SEARCH.actors(ev);
  },
};

//Start everything running

APP.init();
