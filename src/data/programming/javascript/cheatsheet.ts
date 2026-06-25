import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptCheatsheet: ProgrammingLesson = {
  id: "cheatsheet",
  title: "Cheatsheet",

  sections: [
    {
      title: "Variabler",
      code: `const navn = "Julie";
let alder = 19;`,
    },

    {
      title: "Datatyper",
      code: `String
Number
Boolean
Null
Undefined`,
    },

    {
      title: "If-setninger",
      code: `if (alder >= 18) {
  console.log("Myndig");
} else {
  console.log("Ikke myndig");
}`,
    },

    {
      title: "Løkker",
      code: `for (let i = 0; i < 5; i++) {}

while (true) {}

for (const item of array) {}`,
    },

    {
      title: "Funksjoner",
      code: `function hei() {}

const hei = () => {};`,
    },

    {
      title: "Arrays",
      code: `const arr = [];

arr.push();
arr.pop();

arr.length;`,
    },

    {
      title: "Array Methods",
      code: `map()
filter()
find()
forEach()
some()
every()
reduce()`,
    },

    {
      title: "Objects",
      code: `const person = {
  navn: "Julie",
};

person.navn;`,
    },

    {
      title: "DOM",
      code: `document.querySelector();

element.textContent

element.innerHTML

element.classList.add();`,
    },

    {
      title: "Event Listeners",
      code: `button.addEventListener(
  "click",
  () => {}
);`,
    },

    {
      title: "Forms",
      code: `input.value

form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
  }
);`,
    },

    {
      title: "Async / Await",
      code: `async function hent() {
  const data = await fetch(...);
}`,
    },

    {
      title: "Local Storage",
      code: `localStorage.setItem();

localStorage.getItem();

JSON.stringify();

JSON.parse();`,
    },

    {
      title: "Modules",
      code: `export

export default

import`,
    },
  ],
};