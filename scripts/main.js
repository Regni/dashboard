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
    }&sz=32"/> <a href=${this.link} target= _blank> ${this.link.slice(
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
    console.log(this.newDiv);
  }
  add() {
    this.newDiv.classList.add("weatherDiv");
    localStorage.setItem("notes", this.info);
    this.newDiv.innerHTML = `${this.info}`;
    this.noteDiv.appendChild(this.newDiv);
  }
  render() {}
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
  const textArea = document.createElement("textarea");
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
        dashName.innerHTML = `<h1>${textArea.value}'s dashboard</h1>`;
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
    weatherDiv.innerHTML = `<img src=${day.condition.icon} alt = ${day.condition.text}><strong>${dayNames[i]}</strong><p class = "weatherData weatherTemp">${temp}°C</p> <p class= "weatherData weatherText">${day.condition.text}</p>`;
    //add to the div
    console.log(day.condition.text.length);
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

initializeAll();

function initializeAll() {
  dashboardName();
  renderTime();
  setInterval(renderTime, 1000);
  renderLinks();
  linkBtn.addEventListener("click", addLinks);
  getWeatherData();
  setEventListeners();
}

function setEventListeners() {
  //noteModal
  const modal = document.getElementById("noteModal");
  noteBtn.addEventListener("click", () => {
    const noteDiv = document.getElementById("notes");
    const newDiv = document.createElement("div");
    modal.style.display = "block";
  });
  //close noteModal
  const windowClick = modal.addEventListener("click", (e) => {
    console.log(e.target.className);
    if (e.target == modal || e.target.className == "close") {
      console.log("test");
      modal.style.display = "none";
      modal.removeEventListener("click", windowClick);
    }
  });
}
