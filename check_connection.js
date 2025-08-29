(function(window) {
  'use strict';

  /**
   * Функция находит все материалы с текстурами и добавляет им кнопку вращения.
   */
  function addRotationButtons() {
    // Ищем все обертки материалов, в которых еще нет кнопки
    document.querySelectorAll(".acc_block .mat_wrapper:not(:has(.rotate_material))").forEach(wrapper => {
      const materialDiv = wrapper.querySelector(".material");
      if (!materialDiv) return;

      // ПРОБЛЕМА 1: Не добавляем кнопку на цвета.
      // Эта проверка отсеивает элементы без фонового изображения (т.е. сплошные цвета, заданные через background-color).
      const hasBackgroundImage = materialDiv.style.backgroundImage && materialDiv.style.backgroundImage !== "none";
      if (!hasBackgroundImage) {
        return; // Пропускаем этот элемент
      }

      // ПРОБЛЕМА 2: Используем правильную иконку.
      // Создаем кнопку и вставляем в нее стандартную иконку, как вы и указали.
      const btn = document.createElement("div");
      btn.className = "rotate_material";
      btn.innerHTML = '<span class="glyphicon glyphicon-repeat"></span>';

      wrapper.appendChild(btn);
    });
  }

  /**
   * Обработчик клика на кнопку вращения.
   */
  function handleRotationClick(event) {
    const rotateButton = event.target.closest(".rotate_material");
    if (!rotateButton) {
      return; // Клик был не по кнопке вращения
    }

    const wrapper = rotateButton.closest(".mat_wrapper");
    if (!wrapper) return;

    const matId = wrapper.getAttribute("data-id");
    if (!matId) {
      alert("Не найден data-id у родительского элемента .mat_wrapper");
      return;
    }

    // ПРОБЛЕМА 3: Вращаем текстуру на сцене, а не на панели.
    // Этот скрипт НЕ вращает элемент на панели. Он лишь находит ID материала
    // и вызывает глобальную функцию window.rotate_material, передавая ей нужный объект из 3D-сцены.
    // Логика здесь верная.
    const targetObjectInScene = window.materials_map?.[matId];

    if (targetObjectInScene && typeof window.rotate_material === 'function') {
      alert(`Вращаем материал на сцене: ${matId}`);
      window.rotate_material(targetObjectInScene); // <--- Вот здесь происходит вызов основной функции
    } else {
      alert("Функция window.rotate_material или карта материалов window.materials_map не определены.");
    }
  }

  // --- Инициализация ---

  // 1. Сразу запускаем поиск и добавление кнопок для уже загруженных материалов.
  addRotationButtons();

  // 2. Создаем наблюдатель, который будет отслеживать добавление новых материалов на страницу
  // (например, при переключении вкладок) и добавлять кнопки к ним.
  const observer = new MutationObserver(addRotationButtons);
  observer.observe(document.body, { childList: true, subtree: true });

  // 3. Вешаем один обработчик кликов на весь документ для эффективности.
  document.addEventListener("click", handleRotationClick);


})(window);