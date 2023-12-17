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
  const linkBtn = document.getElementById("linkBtn");
  const linksInput = document.createElement("input");
  linksInput.type = "text";
  linksInput.placeholder = "Write link to add";
  linksInput.id = "linkText";
  linksInput.className = "plusBtn";
  linksInput.addEventListener("keydown", (buttonPress) => {
    if (buttonPress.key == "Enter") {
      buttonPress.preventDefault();
      linksInput.replaceWith(linkBtn);
    }
  });
  linkBtn.replaceWith(linksInput);
}

function renderLinks(allLinks) {
  const container = document.getElementById("links");
  allLinks.forEach((link) => {
    const newLinkDiv = document.createElement("div");
    const finalDot = link.lastIndexOf(".");
    let sliceAmount;
    if (/www\./i.test(link)) {
      sliceAmount = 12;
    } else {
      sliceAmount = 8;
    }
    newLinkDiv.id = "linkDiv-" + link.slice(sliceAmount, finalDot);
    newLinkDiv.className = "linkDiv";
    newLinkDiv.innerHTML = `<img src="https://s2.googleusercontent.com/s2/favicons?domain=${link}"/> <a href=${link} target= _blank> ${link.slice(
      sliceAmount,
      finalDot
    )}</a><button class=deleteLink> x </button>`;

    container.appendChild(newLinkDiv);
  });
}
let linkArray = [
  "https://developer.mozilla.org/en-US/docs/Web/API/setInterval",
  "https://translate.google.com/",
  "https://www.wowhead.com/",
];
renderLinks(linkArray);

initializeAll();

function initializeAll() {
  dashboardName();
  renderTime();
  setInterval(renderTime, 1000);

  //adding eventlistners
  const linksCard = document.getElementById("links");
  const linkBtn = document.getElementById("linkBtn");
  linksCard.addEventListener("click", (e) => {
    if (e.target.className == "deleteLink") {
      removeLink(e.target.parentNode.id);
    }
  });

  linkBtn.addEventListener("click", addLinks);
}

function removeLink(id) {
  const deleteLink = document.getElementById(id);
  deleteLink.remove();
}
