const display = document.getElementById("display");
const historyDisplay = document.getElementById("history");

let expression = "";
let justCalculated = false;

function updateDisplay(value = expression) {
    display.value = value || "0";
}

function clearCalculator() {
    expression = "";
    historyDisplay.textContent = "";
    justCalculated = false;
    updateDisplay();
}

function deleteLast() {
    if (justCalculated) {
        clearCalculator();
        return;
    }

    expression = expression.slice(0, -1);
    updateDisplay();
}

function addValue(value) {
    if (justCalculated) {
        expression = "";
        historyDisplay.textContent = "";
        justCalculated = false;
    }

    expression += value;
    updateDisplay();
}

function calculateResult() {
    if (!expression) return;

    try {
        let calculation = expression;

        // Convert percentage into decimal percentage.
        calculation = calculation.replace(
            /(\d+(?:\.\d+)?)%/g,
            "($1/100)"
        );

        // Allow only calculator-safe characters.
        if (!/^[0-9+\-*/().\s]+$/.test(calculation)) {
            throw new Error("Invalid expression");
        }

        const result = Function(
            `"use strict"; return (${calculation})`
        )();

        if (!Number.isFinite(result)) {
            throw new Error("Invalid calculation");
        }

        const formattedResult =
            Number.isInteger(result)
                ? result.toString()
                : parseFloat(result.toFixed(10)).toString();

        historyDisplay.textContent = expression + " =";
        expression = formattedResult;
        updateDisplay(formattedResult);

        justCalculated = true;

    } catch (error) {
        historyDisplay.textContent = "Invalid calculation";
        expression = "";
        display.value = "Error";

        justCalculated = true;
    }
}

/* =========================
   BUTTON EVENTS
========================= */

document.querySelectorAll("[data-value]").forEach(button => {

    button.addEventListener("click", () => {

        const value = button.dataset.value;

        addValue(value);

    });

});


document
    .querySelector('[data-action="clear"]')
    .addEventListener("click", clearCalculator);


document
    .querySelector('[data-action="delete"]')
    .addEventListener("click", deleteLast);


document
    .querySelector('[data-action="calculate"]')
    .addEventListener("click", calculateResult);


/* =========================
   KEYBOARD SUPPORT
========================= */

document.addEventListener("keydown", event => {

    const key = event.key;

    if (
        (key >= "0" && key <= "9") ||
        key === "." ||
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/" ||
        key === "%"
    ) {
        event.preventDefault();
        addValue(key);
    }

    else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculateResult();
    }

    else if (key === "Backspace") {
        event.preventDefault();
        deleteLast();
    }

    else if (key === "Escape") {
        event.preventDefault();
        clearCalculator();
    }

});