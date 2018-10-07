/**
 * This an example!
 */
export class ButtonItem {
  ct = 0;
  element: HTMLElement;
  constructor(txt: string = "Some text") {

    this.element = document.createElement("span");
    this.element.innerHTML = `<button class='button'>${txt}</button>`;

    this.element.addEventListener("click", e => {
      console.log(
        "txt? ",
        this.element.textContent,
        "nval",
        this.element.nodeValue
      );
      this.element.innerHTML = `<button class='button'>${this.ct++}</button>`;
    });
  }
  draw(): HTMLElement {
    return this.element;
  }
}
