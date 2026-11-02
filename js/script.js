const contactForm = document.getElementById("contactForm");

if (contactForm) {
    
    const SERVICE_ID = "service_ecr2doh";
    const TEMPLATE_ID = "template_1pm0lpf";

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");
    const formMessage = document.getElementById("formMessage");
    const sendButton = contactForm.querySelector('input[type="submit"]');

    function isEmailValid(email) {
        return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email);
    }

    function isPhoneValid(phone) {
        return /^[0-9]{10}$/.test(phone.replace(/\s/g, ""));
    }

    function showStatus(input, isValid) {
        const wrap = input.parentElement;
        wrap.classList.remove("valid", "invalid");
        wrap.classList.add(isValid ? "valid" : "invalid");
    }

    function clearStatus(input) {
        input.parentElement.classList.remove("valid", "invalid");
    }

    emailInput.addEventListener("blur", function () {
        const email = emailInput.value.trim();

        if (email === "") {
            clearStatus(emailInput);
            return;
        }

        showStatus(emailInput, isEmailValid(email));
    });

    phoneInput.addEventListener("blur", function () {
        const phone = phoneInput.value.trim();

        if (phone === "") {
            clearStatus(phoneInput);
            return;
        }

        showStatus(phoneInput, isPhoneValid(phone));
    });

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const emailOk = isEmailValid(emailInput.value.trim());
        const phoneOk = isPhoneValid(phoneInput.value.trim());

        const somethingEmpty =
            nameInput.value.trim() === "" ||
            subjectInput.value.trim() === "" ||
            messageInput.value.trim() === "";

        showStatus(emailInput, emailOk);
        showStatus(phoneInput, phoneOk);

        if (!emailOk || !phoneOk) {
            formMessage.textContent = "Please enter the correct email or phone number.";
            formMessage.className = "fail";
        } else if (somethingEmpty) {
            formMessage.textContent = "Please fill in all the fields.";
            formMessage.className = "fail";
        } else {
            
            const templateParams = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                subject: subjectInput.value.trim(),
                message: messageInput.value.trim()
            };

            formMessage.textContent = "Sending your message...";
            formMessage.className = "";
            sendButton.disabled = true;

            emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
                .then(function () {
                    formMessage.textContent = "Your message has been sent successfully. Thank you for contacting us!";
                    formMessage.className = "success";
                    contactForm.reset();
                    clearStatus(emailInput);
                    clearStatus(phoneInput);
                })
                .catch(function (error) {
                    console.log("EmailJS error:", error);
                    formMessage.textContent = "Sorry, your message could not be sent. Please try again.";
                    formMessage.className = "fail";
                })
                .finally(function () {
                    sendButton.disabled = false;
                });
        }
    });
}


const lightbox = document.getElementById("lightbox");

if (lightbox) {
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const closeBtn = document.getElementById("closeLightbox");
    const galleryImages = document.querySelectorAll(".gallery-img");

    galleryImages.forEach(function (img) {
        img.addEventListener("click", function () {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = img.alt;
            lightbox.classList.add("active");
        });
    });

    function closeLightbox() {
        lightbox.classList.remove("active");
    }

    closeBtn.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeLightbox();
        }
    });
}

const searchBox = document.getElementById("searchBox");

if (searchBox) {
    const sortBox = document.getElementById("sortBox");
    const noResults = document.getElementById("noResults");
    const groups = document.querySelectorAll(".menu-group");

    function getName(item) {
        return item.textContent.split(" - R")[0];
    }

    function getPrice(item) {
        return Number(item.textContent.split(" - R")[1]);
    }

    function updateMenu() {
        const term = searchBox.value.trim().toLowerCase();
        let anyShown = false;

        groups.forEach(function (group) {
            const items = Array.from(group.querySelectorAll(".menu-item"));

            if (sortBox.value === "az") {
                items.sort(function (a, b) { return getName(a).localeCompare(getName(b)); });
            } else if (sortBox.value === "low") {
                items.sort(function (a, b) { return getPrice(a) - getPrice(b); });
            } else {
                items.sort(function (a, b) { return getPrice(b) - getPrice(a); });
            }

            let matches = 0;
            items.forEach(function (item) {
                const isMatch = getName(item).toLowerCase().includes(term);
                item.style.display = isMatch ? "" : "none";
                group.appendChild(item);
                if (isMatch) {
                    matches++;
                }
            });

            group.style.display = matches > 0 ? "" : "none";
            if (matches > 0) {
                anyShown = true;
            }
        });

        noResults.textContent = anyShown ? "" : "No items match your search.";
    }

    searchBox.addEventListener("input", updateMenu);
    sortBox.addEventListener("change", updateMenu);
    updateMenu();
}


const dateTime = document.getElementById("dateTime");

if (dateTime) {
    function updateDateTime() {
        const now = new Date();

        const dateText = now.toLocaleDateString("en-ZA", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        const timeText = now.toLocaleTimeString("en-ZA", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        dateTime.textContent = dateText + " | " + timeText;
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
}