// rotate_acc_block.js
(function(window) {
  'use strict';

  console.log("Rotate material script for acc_block loaded");

  // Вешаем обработчик клика
  document.addEventListener("click", function(e) {
    if (e.target && e.target.classList.contains("rotate-material-btn")) {
      let block = e.target.closest(".acc_block");
      if (!block) return;

      // id материала (или объекта)
      let objId = block.getAttribute("data-object-id");
      if (!objId) {
        console.warn("Нет object-id у acc_block");
        return;
      }

      // ищем объект в глобальной карте (как у фасадов)
      let targetObj = window.objects_map?.[objId];
      if (!targetObj) {
        console.warn("Объект с id", objId, "не найден");
        return;
      }

      // вызываем rotate_material из основного кода
      if (typeof window.rotate_material === "function") {
        window.rotate_material(targetObj);
        console.log("Материал объекта", objId, "повёрнут");
      } else {
        console.error("rotate_material не найден в window");
      }
    }
  });

})(window);
