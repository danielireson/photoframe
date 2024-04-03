const initialData = window.__INITIAL_DATA__ ?? {};
const images = initialData.images ?? [];
const app = document.getElementById("app");

if (!images.length) {
  app.classList.add("is-message");

  const h1 = document.createElement("h1");
  const text = document.createTextNode("No images to display");

  h1.appendChild(text);
  app.appendChild(h1);
} else {
  app.classList.add("is-slideshow");

  const slide = document.createElement("div");
  slide.classList.add("slide");
  slide.style.backgroundImage = `url(${images[0]})`;

  app.appendChild(slide);

  const maxImageIndex = images.length - 1;
  let currentImageIndex = 0;

  setInterval(() => {
    if (currentImageIndex < maxImageIndex) {
      currentImageIndex++;
    } else {
      currentImageIndex = 0;
    }

    slide.style.backgroundImage = `url(${images[currentImageIndex]})`;
  }, 2000);
}
