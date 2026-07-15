"use strict";

document.body.classList.remove("is-preload");

const printButton = document.getElementById("print-resume");

if (printButton) {
	printButton.addEventListener("click", () => window.print());
}
