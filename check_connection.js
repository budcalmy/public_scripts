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
      const hasBackgroundImage = materialDiv.style.backgroundImage && materialDiv.style.backgroundImage !== "none";
      if (!hasBackgroundImage) {
        return;
      }

      // Создаем кнопку. jQuery обработчик ниже сам найдет ее.
      const btn = document.createElement("div");
      btn.className = "rotate_material";
      btn.innerHTML = '<span class="glyphicon glyphicon-repeat"></span>';

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


  // --- ОБРАБОТЧИК КЛИКОВ (РЕШЕНИЕ ПРОБЛЕМЫ) ---

  // Мы вешаем свой собственный делегированный обработчик на document.body.
  // Он будет работать для ВСЕХ кнопок .rotate_material, включая те,
  // что находятся в "проблемной" панели.
  $(document.body).on('click', '.acc_block .rotate_material', function() {
    // 'this' здесь — это элемент .rotate_material, по которому кликнули
    const wrapper = $(this).closest(".mat_wrapper");

    if (!wrapper.length) {
      return;
    }

    const matId = wrapper.data("id"); // Используем .data() из jQuery для получения data-id
    if (!matId) {
      alert("Не найден data-id у .mat_wrapper");
      return;
    }

    // Эта логика теперь сработает, так как обработчик вызывается в нужный момент,
    // когда все глобальные объекты и функции уже определены.
    const targetObj = window.materials_map?.[matId];

    if (targetObj && typeof window.rotate_material === "function") {
      alert(`Вращаем материал ${matId} через наш обработчик.`);
      window.rotate_material(targetObj);
    } else {
      // Эта ошибка теперь не должна появляться
      alert("Функция window.rotate_material или карта материалов window.materials_map не определены.");
    }
  });


  alert("Скрипт вращения материалов с собственным обработчиком инициализирован.");

})(window, window.jQuery);