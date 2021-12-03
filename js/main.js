//app is for general control over the application
//and connections between the other components
let instructions = document.querySelector("#instructions");
let actors = document.querySelector("#actors");
let media = document.querySelector("#media");
let baseImageUrl = null;
let apiData = null;
let searchTerm = document.getElementById("search").value;

let api_key = "3bc7d6ace3ce80689836d2664ae1b1ac";

const APP = {
  init: () => {
    //this function runs when the page loads
    console.log("---> Getting Configuration");
    let form = document.querySelector("form");
    form.addEventListener("submit", SEARCH.actors);
    let configUrl = `https://api.themoviedb.org/3/configuration?api_key=${api_key}`;
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
    let url = `https://api.themoviedb.org/3/search/person?api_key=${api_key}&query=${searchTerm}`;
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
      img.setAttribute("src", baseImageUrl + element.profile_path);
      let h4 = document.createElement("h4");
      h4.innerHTML = element.name;
      let p = document.createElement("p");
      p.innerHTML = element.popularity;
      let divText = document.createElement("div");
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
      actors.children[1].addEventListener("click", MEDIA.actorInfo);
    });
    console.log("---> Fetching Talent Success");
    console.log("---> Talent displayed Successfully");
    console.log("---> Click On image For Additional Info");
  },
};

//media is for changes connected to content in the media section
const MEDIA = {
  actorInfo: (event) => {
    media.classList.add("active");
    actors.children[1].style.display = "none";
    actors.children[0].addEventListener("click", SEARCH.actors);

   let actor =  apiData.results.filter(
      (element) =>
        element.id === event.target.parentElement.getAttribute("data-actorId")
    );

    actor.results.known_for.forEach(element=>{
      let div = document.createElement("div");
      let img = document.createElement("img");
      img.setAttribute("src", baseImageUrl + element.poster_path);
      let h4 = document.createElement("h4");
      h4.innerHTML = element.name;
      let p = document.createElement("p");
      p.innerHTML = element.popularity;
      let divText = document.createElement("div");
      div.classList.add("card");
      divText.appendChild(h4);
      divText.appendChild(p);
      div.appendChild(img);
      div.appendChild(divText);
    })
    console.log(
      "--> Getting Talent Details",
      event.target.parentElement.getAttribute("data-actorId")
    );
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
