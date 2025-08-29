(function(window, $) {
  'use strict';

  // Проверяем, загружен ли jQuery
  if (!$) {
    alert('jQuery не найден. Скрипт не может быть выполнен.');
    return;
  }

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

      // Пропускаем материалы-цвета
      // const hasBackgroundImage = materialDiv.style.backgroundImage && materialDiv.style.backgroundImage !== "none";
      // if (!hasBackgroundImage) {
      //   return;
      // }

      // Создаем кнопку. jQuery обработчик ниже сам найдет ее.
      const btn = document.createElement("div");
      btn.className = "rotate_material";
      btn.innerHTML = '<span class="glyphicon glyphicon-repeat" style="padding-left: 5px; color: #ffffff;"></span>';

      wrapper.appendChild(btn);
    });
  }

  // --- Инициализация добавления кнопок ---

  // 1. Сразу запускаем для элементов, которые уже есть на странице.
  addRotationButtons();

  // 2. Наблюдаем за появлением новых материалов в DOM.
  const observer = new MutationObserver(addRotationButtons);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });



  alert("Скрипт вращения материалов с собственным обработчиком инициализирован.");

})(window, window.jQuery);