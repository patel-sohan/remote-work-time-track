import { useState, useEffect } from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import "./LazyImage.css";

const LazyImage = ({
  src,
  alt,
  placeholder = "/placeholder.png",
  className = "",
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Load image when it comes into view
  useEffect(() => {
    if (isIntersecting && imageSrc === placeholder) {
      setImageSrc(src);
    }
  }, [isIntersecting, src, imageSrc, placeholder]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setImageSrc(placeholder);
  };

  return (
    <div ref={imageRef} className={`lazy-image-container ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`lazy-image ${isLoaded ? "loaded" : ""} ${
          hasError ? "error" : ""
        }`}
        {...props}
      />
      {!isLoaded && !hasError && (
        <div className="lazy-image-placeholder">
          <div className="lazy-image-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
