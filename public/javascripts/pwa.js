const init = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("Service worker has been registered!"))
      .catch((err) => console.log("Failed to register service worker."));
  }
};

document.addEventListener("DOMContentLoaded", init, false);
