(function(window) {
  'use strict';

  console.log("Rotate material script for acc_block loaded");

  function insertRotateButtons() {
    document.querySelectorAll(".acc_block .mat_wrapper").forEach(wrapper => {
      if (!wrapper.querySelector(".rotate_material")) {
        let btn = document.createElement("div");
        btn.className = "rotate_material";
        btn.title = "Повернуть материал";
        btn.innerText = "⟳";
        btn.style.cursor = "pointer";
        btn.style.display = "inline-block";
        btn.style.marginLeft = "6px";
        btn.style.fontWeight = "bold";
        btn.style.userSelect = "none";

        wrapper.appendChild(btn);
      }
    });
  }

  insertRotateButtons();

  const observer = new MutationObserver(() => insertRotateButtons());
  observer.observe(document.body, { childList: true, subtree: true });

  // Храним угол поворота превью для каждого материала
  const rotations = {};

  document.addEventListener("click", function(e) {
    if (e.target && e.target.classList.contains("rotate_material")) {
      let wrapper = e.target.closest(".mat_wrapper");
      if (!wrapper) return;

      let matId = wrapper.getAttribute("data-id");
      if (!matId) {
        console.warn("Нет data-id у mat_wrapper");
        return;
      }

      // 1. крутим материал в 3D
      let targetObj = window.materials_map?.[matId];
      if (targetObj && typeof window.rotate_material === "function") {
        window.rotate_material(targetObj);
        console.log("Материал", matId, "повёрнут в 3D");
      }

      // 2. обновляем превью в UI
      let materialDiv = wrapper.querySelector(".material");
      if (materialDiv) {
        // увеличиваем угол на 90°, сбрасываем после 360°
        rotations[matId] = ((rotations[matId] || 0) + 90) % 360;
        materialDiv.style.transform = `rotate(${rotations[matId]}deg)`;
        materialDiv.style.transformOrigin = "center center";
      }
    }
  });

})(window);
