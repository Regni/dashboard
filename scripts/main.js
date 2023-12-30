class Linkdiv {
  constructor(link, parent) {
    this.link = link;
    this.parent = parent;
    this.linkDiv = null;
  }

  add() {
    //create new div
    this.linkDiv = document.createElement("div");
    //auto label maker
    const finalDot = this.link.lastIndexOf(".");
    let sliceAmount;
    if (/www\./i.test(this.link)) {
      sliceAmount = 12;
    } else {
      sliceAmount = 8;
    }
    //attributes
    this.linkDiv.id = "linkDiv-" + this.link.slice(sliceAmount, finalDot);
    this.linkDiv.className = "linkDiv";
    //format
    this.linkDiv.innerHTML = `<img src="https://s2.googleusercontent.com/s2/favicons?domain=${
      this.link
    }&sz=32"/  alt = "img of the website"> <a href=${
      this.link
    } target= _blank> ${this.link.slice(
      sliceAmount,
      finalDot
    )}</a><button class=deleteLink> x </button>`;
    //eventListners
    const deleteBtn = this.linkDiv.querySelector("button");
    deleteBtn.addEventListener("click", () => {
      this.removeDiv();
    });
    this.parent.appendChild(this.linkDiv);
  }

  removeDiv() {
    const allLinks = localStorage.getItem("links").split(",");
    localStorage.setItem(
      "links",
      allLinks.filter((links) => links != this.link)
    );
    this.linkDiv.remove();
  }
}

class Notes {
  constructor(info) {
    this.info = info;
    this.noteDiv = document.getElementById("notes");
    this.newDiv = document.createElement("div");
  }
  add() {
    this.render();
    let storage = localStorage.getItem("notes").split(",");
    console.log(storage);
    if (storage[0] == "") {
      localStorage.setItem("notes", this.info);
    } else {
      storage.push(this.info);
      localStorage.setItem("notes", storage);
    }
  }
  render() {
    this.newDiv.classList.add("weatherDiv");
    // localStorage.setItem("notes", this.info);
    this.newDiv.innerHTML = `<p>${this.info}</p><button class=deleteLink> x </button>`;
    this.noteDiv.appendChild(this.newDiv);

    const deleteBtn = this.newDiv.querySelector("button");
    deleteBtn.addEventListener("click", () => {
      this.remove();
    });
  }
  remove() {
    const allNotes = localStorage.getItem("notes").split(",");
    localStorage.setItem(
      "notes",
      allNotes.filter((notes) => notes != this.info)
    );
    this.newDiv.remove();
  }
}

function renderTime() {
  const time = document.querySelector("header");
  //get current date
  const currentTime = new Date();
  //format time and date to desired output
  time.innerHTML = `<strong>${currentTime.toLocaleTimeString("it-IT", {
    hour: "numeric",
    minute: "numeric",
  })}</strong> ${currentTime.toLocaleDateString("se-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;
}

function dashboardName() {
  //add and find current elements
  const dashName = document.querySelector("h1");
  const textArea = document.createElement("input");
  textArea.type = "text";
  //get name from localstorage and format
  dashName.innerHTML = `${localStorage.getItem("dashboardName")}'s dashboard`;
  //add a onclick to swap to user input
  dashName.onclick = function () {
    //remove the dashboard part
    textArea.value = dashName.textContent.slice(0, -12);
    //show and focus the new textarea
    dashName.replaceWith(textArea);
    textArea.focus();
    //wait for enter and store new data in local storage
    textArea.addEventListener("keydown", (e) => {
      const newH1 = document.createElement("h1");
      if (e.key == "Enter") {
        e.preventDefault();
        localStorage.setItem("dashboardName", `${textArea.value}`);
        dashName.innerHTML = `${textArea.value}'s dashboard`;
        //swap back to H1
        textArea.replaceWith(dashName);
      }
    });
  };
}

function addLinks() {
  //get and create elements
  const parentDiv = document.getElementById("links");
  const linkBtn = document.getElementById("linkBtn");
  const linksInput = document.createElement("input");
  //Attributs for textinput
  linksInput.type = "text";
  linksInput.placeholder = "Write link to add";
  linksInput.id = "linkText";
  linksInput.className = "plusBtn";
  //event listener when the user press enter take all info in.
  linksInput.addEventListener("keydown", (buttonPress) => {
    if (buttonPress.key == "Enter") {
      //prevent the next line
      buttonPress.preventDefault();
      //check if local storage is empty
      if (linksInput.value != "") {
        let linkKey = localStorage.getItem("links").split(",");
        if (linkKey[0] == "") {
          linkKey[0] = linksInput.value;
        } else {
          linkKey.push(linksInput.value);
        }
        localStorage.setItem("links", linkKey);
      }
      //create new div
      new Linkdiv(linksInput.value, parentDiv).add();

      linksInput.replaceWith(linkBtn);
    }
  });
  linkBtn.replaceWith(linksInput);
}

function renderLinks() {
  let allLinks = localStorage.getItem("links").split(",");
  const container = document.getElementById("links");
  if (allLinks[0] != "") {
    allLinks.forEach((link) => {
      new Linkdiv(link, container).add();
    });
  }
}

async function getWeatherData() {
  const weatherRespons = fetch(
    "https://api.weatherapi.com/v1/forecast.json?key=118d6b25ea4c4ed1a72180155232012&q=linköping&days=3&aqi=no&alerts=no"
  ).then((res) => {
    if (res.ok) {
      res.json().then((data) => {
        createWeatherDiv(data);
      });
    }
  });
}

function createWeatherDiv(data) {
  //filter which days to show
  const days = [
    data.current,
    data.forecast.forecastday[1].day,
    data.forecast.forecastday[2].day,
  ];
  //Names of the days for the div
  const dayNames = [
    "Today",
    "Tomorrow",
    new Date(data.forecast.forecastday[2].date).toLocaleDateString("en-US", {
      weekday: "long",
    }),
  ];
  //get the card
  const weatherCard = document.getElementById("weather");
  //loop through the data and get relevent info
  for (let i = 0; i < days.length; i++) {
    let day = days[i];
    let temp = day.avgtemp_c;
    if (day == days[0]) {
      temp = day.temp_c;
    }
    const weatherDiv = document.createElement("div");
    weatherDiv.className = "weatherDiv";
    weatherDiv.id = dayNames[i];
    //format into the div
    weatherDiv.innerHTML = `<img src=${day.condition.icon} alt = "${day.condition.text}"><strong>${dayNames[i]}</strong><p class = "weatherData weatherTemp">${temp}°C</p> <p class= "weatherData weatherText">${day.condition.text}</p>`;
    //add to the div
    if (day.condition.text.length > 10) {
      weatherDiv.lastChild.addEventListener("mouseenter", () => {
        weatherDiv.lastChild.classList.remove("weatherText");
        weatherDiv.lastChild.classList.add("hidden");
        weatherDiv.lastChild.classList.add("weatherLongText");
        // weatherDiv.lastChild.classList.remove("hidden");
      });
      weatherDiv.lastChild.addEventListener("mouseout", () => {
        weatherDiv.lastChild.className = "weatherData weatherText";
      });
    }
    weatherCard.appendChild(weatherDiv);
  }
}
function renderNotes() {
  const allNotes = localStorage.getItem("notes").split(",");
  console.log(allNotes);
  allNotes.forEach((note) => {
    new Notes(note).render();
  });
}
initializeAll();

function initializeAll() {
  dashboardName();
  renderTime();
  setInterval(renderTime, 1000);
  renderLinks();
  note();
  getWeatherData();
  setEventListeners();
  //renderNotes();
}

function note() {
  const noteField = document.getElementById("noteField");
  noteField.value = localStorage.getItem("note");
  noteField.addEventListener("input", () => {
    localStorage.setItem("note", noteField.value);
  });
}

saveNote();
function saveNote() {
  const noteField = document.getElementById("noteField");
}

function setEventListeners() {
  /*
  //noteModal
  const modal = document.getElementById("noteModal");
  const noteDiv = document.getElementById("noteContent");
  noteBtn.addEventListener("click", () => {
    const newDiv = document.createElement("textarea");
    const saveBtn = document.createElement("button");
    saveBtn.innerHTML = "save";
    saveBtn.addEventListener("click", () => {
      new Notes(newDiv.value).add();
      closeModal();
    });
    noteDiv.appendChild(newDiv);
    noteDiv.appendChild(saveBtn);
    modal.style.display = "block";
  });
  //close noteModal
  const windowClick = modal.addEventListener("click", (e) => {
    if (e.target == modal || e.target.className == "close") {
      closeModal();
    }
  });
  function closeModal() {
    noteDiv.innerHTML = "";
    modal.style.display = "none";
    modal.removeEventListener("click", windowClick);
  }*/

  linkBtn.addEventListener("click", addLinks);
}
getAffixes();
async function getAffixes() {
  const respons = await fetch(
    "https://raider.io/api/v1/mythic-plus/affixes?region=eu&locale=en"
  );
  if (respons.ok) {
    const affixes = await respons.json();
    affixDiv(affixes.affix_details);
    console.log(affixes.affix_details);
  }
}

function affixDiv(affixes) {
  const affixDiv = document.getElementById("affixes");
  affixes.forEach((affix) => {
    const newDiv = document.createElement("div");
    newDiv.classList.add("test");
    newDiv.innerHTML = `<img src = https://wow.zamimg.com/images/wow/icons/large/${affix.icon}.jpg alt= "${affix.name} affix"><p>${affix.name}</p>`;
    affixDiv.appendChild(newDiv);
    console.log(affix);
  });
}
