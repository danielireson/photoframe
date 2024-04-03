const initialData = window.__INITIAL_DATA__ ?? {};
const images = initialData.images ?? [];
const interval = initialData.interval ?? 10000;
const app = document.getElementById("app");

let currentImageIndex = -1;

const showMessage = (message) => {
  // toggle message view
  app.classList.add("is-message");

  // create message element
  const h1 = document.createElement("h1");
  const text = document.createTextNode(message);

  // append message to app
  h1.appendChild(text);
  app.appendChild(h1);
};

const incrementImageIndex = () => {
  if (currentImageIndex < images.length - 1) {
    // next image exists
    currentImageIndex++;
  } else {
    // end of images
    currentImageIndex = 0;
  }
};

const setCurrentImage = (slide) => {
  slide.style.backgroundImage = `url(${images[currentImageIndex]})`;

  // preload next image to avoid flicker
  if (currentImageIndex < images.length - 1) {
    new Image().src = images[currentImageIndex + 1];
  }
};

const nextSlide = (slide) => {
  incrementImageIndex();
  setCurrentImage(slide);
};

const showSlideshow = () => {
  // toggle slideshow view
  app.classList.add("is-slideshow");

  // create slide element
  const slide = document.createElement("div");
  slide.classList.add("slide");

  // append slide to app
  app.appendChild(slide);

  // initialize first slide
  nextSlide(slide);

  // schedule future slides
  setInterval(() => {
    nextSlide(slide);
  }, interval);
};

const initializeApp = () => {
  if (!images.length) {
    showMessage("No images to display");
  } else {
    showSlideshow();
  }
};

initializeApp();
