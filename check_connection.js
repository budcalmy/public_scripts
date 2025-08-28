(function(window) {
  'use strict';

  console.log("Rotate material script for acc_block loaded");

  function insertRotateButtons() {
    document.querySelectorAll(".acc_block .mat_wrapper").forEach(wrapper => {
      // если кнопки ещё нет → вставляем
      if (!wrapper.querySelector(".rotate_material")) {
        let btn = document.createElement("div");
        btn.className = "rotate_material";
        btn.title = "Повернуть материал";
        btn.innerText = "⟳"; // можно заменить на иконку
        btn.style.cursor = "pointer";
        btn.style.display = "inline-block";
        btn.style.marginLeft = "6px";
        btn.style.fontWeight = "bold";

        wrapper.appendChild(btn);
      }
    });
  }

  // сразу вставляем при загрузке
  insertRotateButtons();

  // наблюдаем за DOM на случай подгрузки новых материалов
  const observer = new MutationObserver(() => insertRotateButtons());
  observer.observe(document.body, { childList: true, subtree: true });

  // обработчик клика
  document.addEventListener("click", function(e) {
    if (e.target && e.target.classList.contains("rotate_material")) {
      let wrapper = e.target.closest(".mat_wrapper");
      if (!wrapper) return;

      let matId = wrapper.getAttribute("data-id");
      if (!matId) {
        console.warn("Нет data-id у mat_wrapper");
        return;
      }

      // ищем объект материала (как у фасадов)
      let targetObj = window.materials_map?.[matId];
      if (!targetObj) {
        console.warn("Материал с id", matId, "не найден");
        return;
      }

      if (typeof window.rotate_material === "function") {
        window.rotate_material(targetObj);
        console.log("Материал", matId, "повёрнут");
      } else {
        console.error("rotate_material не найден");
      }
    }
  });

})(window);
