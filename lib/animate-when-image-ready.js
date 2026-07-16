function animateWhenImageReady(element, animate) {
  let hasAnimated = false;
  let image = null;

  const play = () => {
    if (hasAnimated) return;
    hasAnimated = true;
    image?.removeEventListener("load", play);
    image?.removeEventListener("error", play);
    animate();
  };

  const waitForImage = () => {
    image = element.querySelector("img");
    if (!image || (image.complete && image.naturalWidth > 0)) {
      play();
      return;
    }
    image.addEventListener("load", play, { once: true });
    image.addEventListener("error", play, { once: true });
  };

  return { waitForImage, play };
}

export { animateWhenImageReady };
