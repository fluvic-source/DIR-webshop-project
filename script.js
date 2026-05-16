let selectedProduct = null;
let lastFocusedElement = null;

document.addEventListener("DOMContentLoaded", () => {
    const productButtons = document.querySelectorAll(".product-card button");
    const checkoutButton = document.getElementById("checkout-button");
    const form = document.getElementById("checkout-form");
    const closePopupButton = document.getElementById("close-popup-button");
    const popup = document.getElementById("mock-popup");
    const requiredFields = form.querySelectorAll("input[required], textarea[required], select[required]");

    productButtons.forEach((button) => {
        button.addEventListener("click", () => {
            addToCart(button.dataset.name, button.dataset.price);
        });
    });

    checkoutButton.addEventListener("click", checkout);

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (validateForm(form)) {
            finishOrder();
        }
    });

    closePopupButton.addEventListener("click", closeMockPopup);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !popup.classList.contains("hidden")) {
            closeMockPopup();
        }
    });
});

function addToCart(name, price) {
    selectedProduct = { name, price };

    const cart = document.getElementById("cart");
    cart.innerHTML = "";

    const item = document.createElement("li");
    item.className = "cart-item-selected";
    item.innerHTML = `<strong>${name}</strong><br><span>${price}</span>`;

    cart.appendChild(item);

    const checkoutButton = document.getElementById("checkout-button");
    checkoutButton.focus();
}

function checkout() {
    const form = document.getElementById("checkout-form");

    if (!selectedProduct) {
        alert("Bitte wählen Sie zuerst ein Produkt aus.");
        return;
    }

    form.classList.remove("hidden");

    const firstInput = form.querySelector("input");
    if (firstInput) {
        firstInput.focus();
    }
}
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll("input[required], textarea[required], select[required]");

    requiredFields.forEach((field) => {
        const fieldWrapper = field.closest(".form-field");
        const error = fieldWrapper.querySelector(".error-message");

        field.removeAttribute("aria-invalid");
        field.removeAttribute("aria-describedby");
        error.textContent = "";

        if (!field.validity.valid) {
            isValid = false;

            if (!error.id) {
                error.id = `${field.id}-error`;
            }

            field.setAttribute("aria-invalid", "true");
            field.setAttribute("aria-describedby", error.id);

            if (field.type === "checkbox" && field.validity.valueMissing) {
                error.textContent = "Bitte akzeptieren Sie die Lizenzbedingungen.";
            } else if (field.validity.valueMissing) {
                error.textContent = "Dieses Feld ist erforderlich.";
            } else if (field.validity.typeMismatch) {
                error.textContent = "Bitte geben Sie einen gültigen Wert ein.";
            } else if (field.validity.patternMismatch) {
                error.textContent = "Bitte geben Sie eine gültige österreichische PLZ mit 4 Ziffern ein.";
            }
        }
    });

    const firstInvalid = form.querySelector('[aria-invalid="true"]');

    if (firstInvalid) {
        firstInvalid.focus();
    }

    return isValid;
}

function finishOrder() {
    const overlay = document.getElementById("loading-overlay");

    overlay.classList.remove("hidden");

    setTimeout(() => {
        overlay.classList.add("hidden");
        openMockPopup();
    }, 800);
}

function openMockPopup() {
    const popup = document.getElementById("mock-popup");
    const closePopupButton = document.getElementById("close-popup-button");

    lastFocusedElement = document.activeElement;

    popup.classList.remove("hidden");
    closePopupButton.focus();
}

function closeMockPopup() {
    const popup = document.getElementById("mock-popup");

    popup.classList.add("hidden");

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}