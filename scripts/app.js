"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbitId;

// page
const page = {
  menu: document.querySelector(".menu__list"),
  header: {
    h1: document.querySelector(".h1"),
    progressPrecent: document.querySelector(".progress__percent"),
    progressCoverBar: document.querySelector(".progress__cover_bar"),
  },
  content: {
    daysConteiner: document.getElementById("days"),
    nextDay: document.querySelector(".habbit__day"),
  },
};

// utils
function loadData() {
  const habbitsString = localStorage.getItem(HABBIT_KEY);
  const habbitArray = JSON.parse(habbitsString);
  if (Array.isArray(habbitArray)) {
    habbits = habbitArray;
  }
}

function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

// render
function rerenderMenu(activHabbit) {
  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id='${habbit.id}']`);
    if (!existed) {
      const element = document.createElement("button");
      element.setAttribute("menu-habbit-id", habbit.id);
      element.classList.add("menu__item");
      element.addEventListener("click", () => rerender(habbit.id));
      element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}" />`;
      if (activHabbit.id === habbit.id) {
        element.classList.add("menu__item_active");
      }
      page.menu.appendChild(element);
      continue;
    }
    if (activHabbit.id === habbit.id) {
      existed.classList.add("menu__item_active");
    } else {
      existed.classList.remove("menu__item_active");
    }
  }
}

function rerenderHead(activHabbit) {
  page.header.h1.innerText = activHabbit.name;
  const progress =
    activHabbit.days.length / activHabbit.target > 1
      ? 100
      : (activHabbit.days.length / activHabbit.target) * 100;
  page.header.progressPrecent.innerText = progress.toFixed(0) + "%";
  page.header.progressCoverBar.setAttribute("style", `width: ${progress}%`);
}

function rerenderContent(activHabbit) {
  page.content.daysConteiner.innerText = "";
  for (const index in activHabbit.days) {
    const element = document.createElement("div");
    element.classList.add("habbit");
    element.innerHTML = `
    <div class="habbit__day">День ${+index + 1}</div>
    <div class="habbit__comment">${activHabbit.days[index].comment}</div>
    <button class="habbit__delete" onclick='deleteDay(${index})'>
    <img src="./images/delete.svg" alt="Удалить день ${index + 1}" />
    </button>
    `;
    page.content.daysConteiner.appendChild(element);
  }
  page.content.nextDay.innerHTML = `День ${activHabbit.days.length + 1}`;
}

function rerender(activHabbitId) {
  globalActiveHabbitId = activHabbitId;
  const activHabbit = habbits.find((habbit) => habbit.id === activHabbitId);
  if (!activHabbit) {
    return;
  }
  rerenderMenu(activHabbit);
  rerenderHead(activHabbit);
  rerenderContent(activHabbit);
}

// work with days

function addDays(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const comment = data.get("comment");
  form["comment"].classList.remove("error");
  if (!comment) {
    form["comment"].classList.add("error");
    return;
  }
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment }]),
      };
    }
    return habbit;
  });
  form["comment"].value = "";
  rerender(globalActiveHabbitId);
  saveData();
}

function deleteDay(index) {
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      habbit.days.splice(index, 1);
      return {
        ...habbit,
        days: habbit.days,
      };
    }
    return habbit;
  });
  rerender(globalActiveHabbitId);
  saveData();
}
// init
(() => {
  loadData();
  rerender(habbits[0].id);
})();
