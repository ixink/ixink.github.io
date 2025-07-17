document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData(form);
    const name = formData.get("name");

    try {
      const response = await fetch("https://formspree.io/f/xqalkvkr", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        formMessage.textContent = `Thank you, ${name}! Your message has been sent. I'll get back to you soon.`;
        formMessage.classList.add("success");
        formMessage.classList.remove("error");
        formMessage.style.display = "block";
        form.reset();

        // Hide message after 5 seconds
        setTimeout(() => {
          formMessage.style.display = "none";
          formMessage.classList.remove("success");
        }, 5000);
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      formMessage.textContent = "Oops! Something went wrong. Please try again later.";
      formMessage.classList.add("error");
      formMessage.classList.remove("success");
      formMessage.style.display = "block";

      // Hide message after 5 seconds
      setTimeout(() => {
        formMessage.style.display = "none";
        formMessage.classList.remove("error");
      }, 5000);
    }
  });
});