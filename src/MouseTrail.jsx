
import { useEffect } from "react";
import "./MouseTrail.css";


function MouseTrail() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    function createSparkle(e) {
      const sparkle = document.createElement("span");

      sparkle.className = "mouse-sparkle";
      sparkle.style.left = e.clientX + "px";
      sparkle.style.top = e.clientY + "px";

      if (Math.random() > 0.5) {
        sparkle.classList.add("gold-sparkle");
      }

      document.body.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 800);
    }

    document.addEventListener("mousemove", createSparkle);

    return () => {
      document.removeEventListener("mousemove", createSparkle);
    };
  }, []);

  return null;
}

export default MouseTrail;
