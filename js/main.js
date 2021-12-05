//app is for general control over the application
//and connections between the other components
let instructions = document.querySelector("#instructions");
let actors = document.querySelector("#actors");
let media = document.querySelector("#media");
let baseImageUrl = null;
let apiData = null;
let searchTerm = null;

let api_key = "3bc7d6ace3ce80689836d2664ae1b1ac";
let baseUrl = "https://api.themoviedb.org/3";

const APP = {
  init: () => {
    //this function runs when the page loads
    console.log("---> Getting Configuration");
    let form = document.querySelector("form");
    form.addEventListener("submit", SEARCH.actors);
    let configUrl = baseUrl + `/configuration?api_key=${api_key}`;
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
      .catch((err) => console.log(err));
    instructions.classList.add("active");
    actors.classList.remove("active");
  },
};

//search is for anything to do with the fetch api

const SEARCH = {
  actors: (event) => {
    event.preventDefault();
    media.classList.remove("active");
    actors.children[1].style.display = "grid";
    console.log("---> Fetching Talent!");
    instructions.classList.remove("active");
    actors.classList.add("active");
    searchTerm = document.getElementById("search").value;
    let url =
      baseUrl +
      `/search/person?api_key=${api_key}&language=en-US&query=${searchTerm}&page=1&include_adult=false`;
    fetch(url)
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error(`${response.status}`);
      })
      .then((data) => {
        apiData = data;
        ACTORS.gotActors(data);
      })
      .catch((err) => console.log(err));
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
        cards[i].addEventListener('click', MEDIA.actorInfo);
    }

    });
    console.log("---> No Cards Available");
    console.log("---> Talent displayed Successfully");
    console.log("---> Click On image For Additional Info");
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
    console.log("--> Getting Talent Details");
    let actor = apiData.results.filter(
      (element) =>
        element.id == event.target.parentElement.getAttribute("data-actorId")
    );

    console.log(actor[0].known_for);

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

//storage is for working with localstorage
const STORAGE = {
  //this will be used in Assign 4
};

//nav is for anything connected to the history api and location
const NAV = {
  //this will be used in Assign 4
};

//Start everything running

APP.init();
