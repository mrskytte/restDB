"use strict";

window.addEventListener("DOMContentLoaded", init);

const endpoint = "https://frontend-028f.restdb.io/rest/mlb-teams";
const apiKey = "5e958922436377171a0c2357";
let editCounter = 0;

function init() {
  get();
}

async function get() {
  const data = await fetch(endpoint, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
  });
  const response = await data.json();
  document.querySelector("main").innerHTML = "";
  showTeams(response);
}

function showTeams(data) {
  data.forEach(showTeam);
}

function showTeam(oneTeam) {
  const template = document.querySelector("#template").content;
  const copy = template.cloneNode("true");

  copy.querySelector("article").dataset.id = oneTeam._id;
  copy.querySelector(".team").textContent = oneTeam.name;
  copy.querySelector(".championships").textContent = oneTeam.championships;
  copy.querySelector(".player").textContent = oneTeam.best_player;
  copy.querySelector(".city").textContent = oneTeam.city;
  copy.querySelector(".delete").addEventListener("click", () => {
    deleteIt(oneTeam._id);
  });
  copy.querySelector(".update").addEventListener("click", () => {
    prepareUpdate(oneTeam._id);
  });

  document.querySelector("main").appendChild(copy);
}

function preparePostData() {
  const form = document.querySelector("form");
  const data = {
    name: form[0].value,
    city: form[1].value,
    best_player: form[2].value,
    championships: form[3].value,
  };
  for (let i = 0; i < 4; i++) {
    form[i].value = "";
  }
  post(data);
}

async function post(data) {
  const postData = JSON.stringify(data);
  const posting = await fetch(endpoint, {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
    body: postData,
  });
  const response = await posting.json();
  showTeam(response);
}

async function deleteIt(id) {
  document.querySelector(`[data-id="${id}"]`).remove();
  const data = await fetch(`${endpoint}/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
  });
  const repsonse = await data.json();
}

function prepareUpdate(id) {
  if (editCounter === 1) {
    editCounter = 0;
    updateIt(id);
    return;
  }
  const element = document.querySelector(`[data-id="${id}"] .content`);
  let data = {
    name: element.children[0].textContent,
    championships: element.children[1].textContent,
    city: element.children[2].textContent,
    best_player: element.children[3].textContent,
  };
  console.log(element.innerHTML);
  element.innerHTML = `<input type="text" id="edit-team" value="${data.name}"> 
  <input type="text" id="edit-championships" value="${data.championships}">
  <input type="text" id="edit-city" value="${data.city}">
  <input type="text" id="edit-player" value="${data.best_player}">`;
  element.parentNode.children[2].textContent = "Done";
  editCounter++;
}

async function updateIt(id) {
  console.log(id);
  let element = document.querySelector(`[data-id="${id}"] .content`);
  let data = {
    name: element.children[0].value,
    championships: element.children[1].value,
    city: element.children[2].value,
    best_player: element.children[3].value,
  };

  let postData = JSON.stringify(data);

  const putData = await fetch(`${endpoint}/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
    body: postData,
  });
  const response = await putData.json();
  showUpdate();
  function showUpdate() {
    const contentTemplate = document.querySelector("#content-template").content;
    const contentCopy = contentTemplate.cloneNode(true);

    contentCopy.querySelector(".team").textContent = response.name;
    contentCopy.querySelector(".championships").textContent =
      response.championships;
    contentCopy.querySelector(".player").textContent = response.best_player;
    contentCopy.querySelector(".city").textContent = response.city;

    document.querySelector(`[data-id="${id}"] .content`).innerHTML = "";
    document
      .querySelector(`[data-id="${id}"] .content`)
      .appendChild(contentCopy);
    document.querySelector(`[data-id="${id}"] .update`).textContent = "Update";
  }
}
