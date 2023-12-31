class Linkdiv {
  constructor(link, label) {
    this.link = link;
    this.parent = document.getElementById("links");
    this.linkDiv = null;
    this.label = label;
  }

  autoLabel() {
    const finalDot = this.link.lastIndexOf(".");
    var sliceAmount = 0;
    if (/www\./i.test(this.link)) {
      sliceAmount = 12;
    } else {
      sliceAmount = 8;
    }
    this.label = this.link.slice(sliceAmount, finalDot);
  }
  add() {
    //create new div
    this.linkDiv = document.createElement("div");
    //auto label maker

    //attributes
    this.linkDiv.id = "linkDiv-" + this.label;
    this.linkDiv.className = "linkDiv";
    //format

    this.linkDiv.innerHTML = `<img src="https://s2.googleusercontent.com/s2/favicons?domain=${this.link}&sz=32"/  alt = "img of the website"> <a href=${this.link} target= _blank> ${this.label}</a><button class=deleteLink> x </button>`;
    //eventListners
    const deleteBtn = this.linkDiv.querySelector("button");
    deleteBtn.addEventListener("click", () => {
      this.removeDiv();
    });
    this.parent.appendChild(this.linkDiv);
  }
  setlabel(label) {
    this.label = label;
  }
  removeDiv() {
    const allLinks = localStorage.getItem("links").split(",");
    localStorage.setItem(
      "links",
      allLinks.filter((links) => links != `${this.link};${this.label}`)
    );
    this.linkDiv.remove();
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
  if (localStorage.getItem("dashboardName") != null) {
    dashName.innerHTML = `${localStorage.getItem("dashboardName")}'s dashboard`;
  }
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

function renderLinks() {
  if (localStorage.getItem("links") != null) {
    let allLinks = localStorage.getItem("links").split(",");
    if (allLinks[0] != "") {
      allLinks.forEach((link) => {
        const allInfo = link.split(";");
        new Linkdiv(allInfo[0], allInfo[1]).add();
      });
    }
  }
}

async function getWeatherData(lat, long) {
  const weatherRespons = fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=118d6b25ea4c4ed1a72180155232012&q=${lat},${long}&days=3&aqi=no&alerts=no`
  ).then((res) => {
    if (res.ok) {
      res.json().then((data) => {
        createWeatherDiv(data);
      });
    }
  });
}

function createWeatherDiv(data) {
  const weatherCard = document.getElementById("weather");
  weatherCard.innerHTML = "<h2>Weather</h2>";
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
  const cityName = document.createElement("h3");
  cityName.innerHTML = data.location.name;
  weatherCard.appendChild(cityName);
  cityName.addEventListener("click", () => {
    const cityField = document.createElement("input");
    cityField.type = "text";
    cityField.id = cityField;

    cityName.replaceWith(cityField);
    cityField.focus();
    cityField.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        e.preventDefault();
        getCityWeather(cityField.value);
        cityField.replaceWith(cityName);
      }
    });
  });
}

initializeAll();

function initializeAll() {
  dashboardName();
  renderTime();
  setInterval(renderTime, 1000);
  renderLinks();
  note();
  getLocation();
  setEventListeners();
  getAffixes();
  renderBackground();
}

function note() {
  const noteField = document.getElementById("noteField");
  noteField.value = localStorage.getItem("note");
  noteField.addEventListener("input", () => {
    localStorage.setItem("note", noteField.value);
  });
}

function setEventListeners() {
  //noteModal
  const modal = document.getElementById("linkModal");
  const linkDiv = document.getElementById("linkContent");
  linkBtn.addEventListener("click", () => {
    const label = document.createElement("input");
    const newLink = document.createElement("input");
    const saveBtn = document.createElement("button");
    label.type = "text";
    label.id = "linkInput";
    label.placeholder = "Link name";
    newLink.placeholder = "url";
    newLink.type = "url";
    newLink.id = "urlInput";

    saveBtn.innerHTML = "save";
    saveBtn.addEventListener("click", () => {
      let website = new Linkdiv(newLink.value, "placeholder");

      if (label.value != "") {
        website.setlabel(label.value);
      } else {
        website.autoLabel();
      }
      if (localStorage.getItem("links") != null) {
        let linkKey = localStorage.getItem("links").split(",");
        if (linkKey[0] == "") {
          linkKey[0] = `${website.link};${website.label}`;
        } else {
          linkKey.push(`${website.link};${website.label}`);
        }
        localStorage.setItem("links", linkKey);
      } else {
        localStorage.setItem("links", `${website.link};${website.label}`);
      }
      website.add();
      closeModal();
    });
    linkDiv.appendChild(label);
    linkDiv.appendChild(newLink);
    linkDiv.appendChild(saveBtn);
    modal.style.display = "block";
  });
  //close noteModal
  const windowClick = modal.addEventListener("click", (e) => {
    if (e.target == modal || e.target.className == "close") {
      closeModal();
    }
  });
  function closeModal() {
    linkDiv.innerHTML = "";
    modal.style.display = "none";
    modal.removeEventListener("click", windowClick);
  }

  //unsplash buttons
  const randUnsplash = document.getElementById("unsplash");
  const resetPicture = document.getElementById("resetPic");
  const userPic = document.getElementById("userPic");
  randUnsplash.addEventListener("click", randomUnsplash);
  userPic.addEventListener("click", () => {
    const keywordInput = document.createElement("input");
    keywordInput.type = "text";
    keywordInput.setAttribute("placeholder", "key word(s) or esc to cancel");
    keywordInput.id = "userPic";
    userPic.replaceWith(keywordInput);

    keywordInput.focus();
    keywordInput.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        e.preventDefault();

        keywordPic(keywordInput.value);
        keywordInput.replaceWith(userPic);
      }
      if (e.key == "Escape") {
        keywordInput.replaceWith(userPic);
      }
    });
  });
  resetPicture.addEventListener("click", resetPic);
}

async function getAffixes() {
  const respons = await fetch(
    "https://raider.io/api/v1/mythic-plus/affixes?region=eu&locale=en"
  );
  if (respons.ok) {
    const affixes = await respons.json();
    affixDiv(affixes.affix_details);
  }
}

function affixDiv(affixes) {
  const affixDiv = document.getElementById("affixes");
  affixes.forEach((affix) => {
    const newDiv = document.createElement("div");
    newDiv.classList.add("affixDiv");
    newDiv.innerHTML = `<img src = https://wow.zamimg.com/images/wow/icons/large/${affix.icon}.jpg alt= "${affix.name} affix"><p>${affix.name}</p>`;
    affixDiv.appendChild(newDiv);
  });
}

async function randomUnsplash() {
  const picRespons = await fetch(
    "https://api.unsplash.com/photos/random/?client_id=Ct-BegIkBATJWi0CO7mHkZ_JHlDenODCdnrnFb25U_4"
  );

  if (picRespons.ok) {
    const picData = await picRespons.json();
    background(picData.urls.regular);

    localStorage.setItem("photo", `${picData.urls.regular}`);
  }
}

function resetPic() {
  document.body.style.setProperty(
    "--background-image",
    `url("../img/geranimo-qzgN45hseN0-unsplash.jpg")`
  );
  localStorage.setItem("photo", "");
}

async function keywordPic(key) {
  const respons = await fetch(
    `https://api.unsplash.com/photos/random/?query=${key}&orientation=landscape&client_id=Ct-BegIkBATJWi0CO7mHkZ_JHlDenODCdnrnFb25U_4`
  );
  if (respons.ok) {
    const photo = await respons.json();

    background(photo.urls.regular);

    localStorage.setItem("photo", `${photo.urls.regular}`);
  }
}

function background(url) {
  if (url != null) {
    const styleBackground = document.body;
    styleBackground.classList.add("dynamic-background");
    styleBackground.style.setProperty("--background-image", `url("${url}")`);
  }
}

function renderBackground() {
  const picture = localStorage.getItem("photo");
  if (picture == "") {
    resetPic();
  } else {
    background(picture);
  }
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(
    (postion) => {
      getWeatherData(postion.coords.latitude, postion.coords.longitude);
    },
    (error) => {
      getCityWeather("sweden");
      console.log(error.message);
    }
  );
}

async function getCityWeather(name) {
  //error but 400 error still is thrown to console
  try {
    const respons = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=118d6b25ea4c4ed1a72180155232012&q=${name}&days=3&aqi=no&alerts=no`
    );

    if (!respons.ok) {
      if (respons.status === 400) {
        const errorData = await respons.json();
        throw new Error(
          `Network problem or city cant be found: ${respons.status}, message: ${errorData.message}`
        );
      } else {
        throw new Error(
          "Network problem or city cant be found: " + respons.status
        );
      }
    }

    const data = await respons.json();
    createWeatherDiv(data);
  } catch (error) {
    console.log("There was a problem city is set back to default", error);
  }
}
