(function(window) {
  'use strict';

  /**
   * Функция находит все материалы с текстурами, у которых еще нет кнопки вращения,
   * и добавляет ее.
   */
  function addRotationButtons() {
    // Выбираем все обертки материалов, в которых еще НЕТ кнопки .rotate_material
    const materialWrappers = document.querySelectorAll(".acc_block .mat_wrapper:not(:has(.rotate_material))");

    materialWrappers.forEach(wrapper => {
      const materialDiv = wrapper.querySelector(".material");
      if (!materialDiv) {
        return;
      }

      // Пропускаем материалы, у которых нет фонового изображения (т.е. это просто цвет).
      const hasBackgroundImage = materialDiv.style.backgroundImage && materialDiv.style.backgroundImage !== "none";
      if (!hasBackgroundImage) {
        return;
      }

      // Создаем кнопку с правильным классом и иконкой.
      // Существующий на странице обработчик из libs.min.js сам найдет эту кнопку по классу ".rotate_material".
      const btn = document.createElement("div");
      btn.className = "rotate_material";
      btn.innerHTML = '<span class="glyphicon glyphicon-repeat"></span>';

      wrapper.appendChild(btn);
    });
  }

  // --- Инициализация скрипта ---

  // 1. Сразу запускаем добавление кнопок для элементов, которые уже есть на странице.
  addRotationButtons();

  // 2. Создаем наблюдатель (MutationObserver), который будет следить за появлением новых
  // материалов (например, при подгрузке) и вызывать для них addRotationButtons.
  const observer = new MutationObserver(addRotationButtons);
  observer.observe(document.body, {
    childList: true, // следить за добавлением/удалением дочерних элементов
    subtree: true   // следить во всем поддереве, а не только в document.body
  });

  console.log("Скрипт добавления кнопок вращения успешно инициализирован.");

})(window);