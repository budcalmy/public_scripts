(function(window, $) {
  'use strict';

  if (!$) {
    alert('jQuery не найден. Скрипт не может быть выполнен.');
    return;
  }

  // Функция для анализа существующих обработчиков
  function analyzeExistingHandlers() {
    // Ищем все существующие кнопки поворота
    const existingBtns = document.querySelectorAll('.rotate_material');
    
    existingBtns.forEach(btn => {
      const events = $._data(btn, 'events');
      if (events && events.click) {
        console.log('Найден обработчик клика для кнопки поворота:', events.click);
      }
    });
  }

  function addRotationButtons() {
    const materialWrappers = document.querySelectorAll(".acc_block .mat_wrapper:not(:has(.my-rotate-btn))");
    
    materialWrappers.forEach(wrapper => {
      const materialDiv = wrapper.querySelector(".material");
      if (!materialDiv) return;

      const btn = document.createElement("div");
      btn.className = "rotate_material my-rotate-btn";
      btn.innerHTML = '<span class="glyphicon glyphicon-repeat" style="padding-left: 5px; color: #ffffff;"></span>';
      
      wrapper.appendChild(btn);
    });
  }

  // Делегированный обработчик
  $(document).on('click', '.my-rotate-btn', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Клик по кастомной кнопке поворота');
    
    // Попытка найти и выполнить оригинальную логику
    const wrapper = this.closest('.mat_wrapper');
    
    // Метод 1: Поиск через селекторы
    const existingRotateBtn = document.querySelector('.mat_wrapper .rotate_material:not(.my-rotate-btn)');
    if (existingRotateBtn) {
      existingRotateBtn.click();
      return;
    }
    
    // Метод 2: Поиск функции в window
    if (typeof window.rotateMaterial === 'function') {
      window.rotateMaterial(wrapper.dataset.id);
      return;
    }
    
    // Метод 3: Вызов через jQuery trigger на похожем элементе
    $('.mat_wrapper .rotate_material').first().trigger('click');
  });

  // Анализируем существующие обработчики при загрузке
  setTimeout(analyzeExistingHandlers, 1000);

  addRotationButtons();

  const observer = new MutationObserver(addRotationButtons);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})(window, window.jQuery);