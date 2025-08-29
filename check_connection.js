(function(window, $) {
  'use strict';

  if (!$) {
    alert('jQuery не найден. Скрипт не может быть выполнен.');
    return;
  }

  function addRotationButtons() {
    const materialWrappers = document.querySelectorAll(".acc_block .mat_wrapper:not(:has(.rotate_material))");
    
    materialWrappers.forEach(wrapper => {
      const materialDiv = wrapper.querySelector(".material");
      if (!materialDiv) return;

      const btn = document.createElement("div");
      btn.className = "rotate_material custom-rotate-btn"; // Добавляем дополнительный класс для отличия
      btn.innerHTML = '<span class="glyphicon glyphicon-repeat" style="padding-left: 5px; color: #ffffff;"></span>';
      
      wrapper.appendChild(btn);
    });
  }

  // Используем делегирование jQuery для новых кнопок
  $(document).on('click', '.custom-rotate-btn', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const wrapper = this.closest('.mat_wrapper');
    const $wrapper = $(wrapper);
    
    // Пытаемся найти оригинальную кнопку поворота и скопировать её поведение
    const originalBtn = wrapper.querySelector('.rotate_material:not(.custom-rotate-btn)');
    
    if (originalBtn) {
      // Если есть оригинальная кнопка, имитируем клик по ней
      $(originalBtn).trigger('click');
    } else {
      // Если оригинальной кнопки нет, ищем паттерн в коде
      // Анализируем data-атрибуты wrapper'а
      const materialId = wrapper.dataset.id;
      
      if (materialId) {
        // Пытаемся найти и вызвать функцию через глобальную область
        if (typeof window.rotateMaterial === 'function') {
          window.rotateMaterial(materialId);
        } else if (typeof window.rotate_material === 'function') {
          window.rotate_material(materialId);
        } else {
          alert('Функция поворота не найдена для материала ID:', materialId);
        }
      }
    }
  });

  addRotationButtons();

  const observer = new MutationObserver(addRotationButtons);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})(window, window.jQuery);