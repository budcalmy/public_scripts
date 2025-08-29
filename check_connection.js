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
      if (!materialDiv) {
        return;
      }

      const btn = document.createElement("div");
      btn.className = "rotate_material";
      btn.innerHTML = '<span class="glyphicon glyphicon-repeat" style="padding-left: 5px; color: #ffffff;"></span>';

      wrapper.appendChild(btn);
    });
  }


  addRotationButtons();

  const observer = new MutationObserver(addRotationButtons);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });


})(window, window.jQuery);