"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";

// page
const page = {
  menu: document.querySelector(".menu__list"),
  header: {
    h1: document.querySelector(".h1"),
    progressPrecent: document.querySelector(".progress__percent"),
    progressCoverBar: document.querySelector(".progress__cover_bar"),
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
  if (!activHabbit) {
    return;
  }
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
  if (!activHabbit) {
    return;
  }
  page.header.h1.innerText = activHabbit.name;
  const progress =
    activHabbit.days.length / activHabbit.target > 1
      ? 100
      : (activHabbit.days.length / activHabbit.target) * 100;
  page.header.progressPrecent.innerText = progress.toFixed(0) + "%";
  page.header.progressCoverBar.setAttribute("style", `width: ${progress}%`);
}

function rerender(activHabbitId) {
  const activHabbit = habbits.find((habbit) => habbit.id === activHabbitId);
  rerenderMenu(activHabbit);
  rerenderHead(activHabbit);
}
// init
(() => {
  loadData();
  rerender(habbits[0].id);
})();
