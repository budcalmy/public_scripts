(function(window) {
  'use strict';

  console.log("Rotate material script for acc_block loaded");

  function insertRotateButtons() {
    document.querySelectorAll(".acc_block .mat_wrapper").forEach(wrapper => {
      // пропускаем, если кнопка уже есть
      if (wrapper.querySelector(".rotate_material")) return;

      const materialDiv = wrapper.querySelector(".material");
      if (!materialDiv) return;

      // пропускаем однотонные цвета (у которых есть background-color rgb)
      const bg = materialDiv.style.backgroundImage;
      if (!bg || bg === "none") return; 

      // создаём кнопку с иконкой, как у rotate_material в фасадах
      const btn = document.createElement("div");
      btn.className = "rotate_material";
      btn.title = "Повернуть материал";
      btn.innerHTML = '<span class="glyphicon glyphicon-repeat"></span>';
      btn.style.cursor = "pointer";
      btn.style.display = "inline-block";
      btn.style.marginLeft = "6px";
      btn.style.userSelect = "none";

      wrapper.appendChild(btn);
    });
  }

  // сразу вставляем
  insertRotateButtons();

  // следим за подгрузкой новых материалов
  const observer = new MutationObserver(() => insertRotateButtons());
  observer.observe(document.body, { childList: true, subtree: true });

  // обработчик клика
  document.addEventListener("click", function(e) {
    if (e.target.closest(".rotate_material")) {
      const btn = e.target.closest(".rotate_material");
      const wrapper = btn.closest(".mat_wrapper");
      if (!wrapper) return;

      const matId = wrapper.getAttribute("data-id");
      if (!matId) {
        console.warn("Нет data-id у mat_wrapper");
        return;
      }

      // крутим материал в 3D
      const targetObj = window.materials_map?.[matId];
      if (targetObj && typeof window.rotate_material === "function") {
        window.rotate_material(targetObj);
        console.log("Материал", matId, "повёрнут в 3D");
      } else {
        console.error("rotate_material или materials_map не найдены");
      }
    }
  });

})(window);
