(function(window) {
    'usestrictest';

    // =================================================================================
    //  ЧАСТЬ 1: ПЕРЕХВАТ КОНСТРУКТОРОВ (БЕЗ ИЗМЕНЕНИЙ)
    // =================================================================================
    const TARGET_CONSTRUCTOR_NAMES = ['Cabinet_new', 'Bardesk_new', 'Shelve_new', 'Model_new', 'Shaft'];
    const wrappedConstructors = new Set();

    function findAndWrapConstructors() {
        TARGET_CONSTRUCTOR_NAMES.forEach(name => {
            if (wrappedConstructors.has(name) || typeof window[name] !== 'function') return;
            
            const OriginalConstructor = window[name];
            wrappedConstructors.add(name);

            window[name] = function(params) {
                if (!params) params = {};
                const newInstance = Reflect.construct(OriginalConstructor, arguments);
                const isMovable = params.isMovable !== false; 
                if (!newInstance.params) {
                    newInstance.params = {};
                }
                newInstance.params.isMovable = isMovable;
                return newInstance;
            };
        });
        
        if (wrappedConstructors.size === TARGET_CONSTRUCTOR_NAMES.length) {
            clearInterval(constructorSearchInterval);
        }
    }

    const constructorSearchInterval = setInterval(findAndWrapConstructors, 250);
    setTimeout(() => { clearInterval(constructorSearchInterval); }, 15000);


    // =================================================================================
    //  ЧАСТЬ 2: МОДИФИКАЦИЯ UI (БЕЗ ИЗМЕНЕНИЙ)
    //  ПРИМЕЧАНИЕ: Чекбокс "Заблокировать перемещение" теперь также блокирует и вращение.
    //  Вы можете захотеть изменить его название на "Заблокировать трансформацию" или "Зафиксировать".
    // =================================================================================
    function addMovableCheckbox() {
        const sizesTab = $("#info_panel_sizes_tab");
        if (!sizesTab.length) return;

        const activeObject = window.active_el;
        if (!activeObject || activeObject.params === undefined) {
             sizesTab.find(".custom-movable-option-block").remove();
             return;
        }

        const shouldBeChecked = activeObject.params.isMovable === false;
        const optionsBlock = sizesTab.find(".custom-movable-option-block");

        if (optionsBlock.length > 0) {
            optionsBlock.find('#custom-isMovable-checkbox').prop('checked', shouldBeChecked);
        } else {
            const newOptionsBlock = $(`
                <div class="form-group row custom-movable-option-block" style="border-top: 1px solid #e7e7e7; padding-top: 15px; margin-top: 15px; margin-left: 0; margin-right: 0;">
                    <div class="col-xs-8">
                        <label for="custom-isMovable-checkbox" style="font-weight: normal; margin: 0;">Заблокировать перемещение</label>
                    </div>
                    <div class="col-xs-4" style="text-align: right;">
                        <input type="checkbox" id="custom-isMovable-checkbox" style="margin-top: 3px;">
                    </div>
                </div>
            `);
            
            sizesTab.append(newOptionsBlock);
            const checkbox = newOptionsBlock.find('#custom-isMovable-checkbox');
            checkbox.prop('checked', shouldBeChecked);
            checkbox.on('change', function() {
                if (window.active_el && window.active_el.params) {
                    window.active_el.params.isMovable = !$(this).is(':checked');
                }
            });
        }
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(mutation => {
            if ( $(mutation.target).find('#info_panel_sizes_tab').length > 0 || $(mutation.target).is('#info_panel.showed') ) {
                 addMovableCheckbox();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });


    // =================================================================================
    //  ЧАСТЬ 3: "УМНАЯ" ЛОГИКА БЛОКИРОВКИ (ДОБАВЛЕНО ВРАЩЕНИЕ)
    // =================================================================================
    
    // Храним состояние: { ref, lastPosition, lastRotation, isInitialized }
    const trackedObjects = new Map();
    const POSITION_EPSILON = 0.0001;

    // "Замечаем" объект для отслеживания
    function trackObject(object) {
        if (!object) return;
        
        object.traverse(child => {
            if (child.isObject3D && child.params?.isMovable !== undefined) {
                if (!trackedObjects.has(child.uuid)) {
                    trackedObjects.set(child.uuid, {
                        ref: child,
                        lastPosition: null, 
                        lastRotation: null, // Добавили поле для вращения
                        isInitialized: false
                    });
                }
            }
        });
    }

    // Удаляем объект из отслеживания
    function untrackObject(object) {
        if (!object) return;
        object.traverse(child => {
            if (trackedObjects.has(child.uuid)) {
                trackedObjects.delete(child.uuid);
            }
        });
    }

    // Главная функция, теперь проверяет и позицию, и вращение.
    function checkTransform() {
        for (const state of trackedObjects.values()) {
            const obj = state.ref;

            // Инициализация: запоминаем первую "устаканившуюся" позицию и вращение.
            if (!state.isInitialized) {
                state.lastPosition = obj.position.clone();
                state.lastRotation = obj.quaternion.clone(); // Запоминаем кватернион
                state.isInitialized = true;
                continue; 
            }

            // Проверяем, изменились ли позиция или вращение.
            const positionChanged = obj.position.distanceToSquared(state.lastPosition) > POSITION_EPSILON;
            const rotationChanged = !obj.quaternion.equals(state.lastRotation);

            if (positionChanged || rotationChanged) {
                // Если объект заблокирован (флаг isMovable === false)
                if (obj.params?.isMovable === false) {
                    // Возвращаем измененные параметры
                    if (positionChanged) {
                        obj.position.copy(state.lastPosition);
                    }
                    if (rotationChanged) {
                        obj.quaternion.copy(state.lastRotation);
                    }
                } else {
                    // Если не заблокирован, обновляем "правильное" состояние
                    if (positionChanged) {
                        state.lastPosition.copy(obj.position);
                    }
                    if (rotationChanged) {
                        state.lastRotation.copy(obj.quaternion);
                    }
                }
            }
        }
    }

    // Запуск цикла с перехватом методов сцены (без изменений).
    (function waitForSceneReady() {
        if (window.room && window.renderer && typeof window.room.add === 'function') {
            const scene = window.room;

            scene.traverse(obj => trackObject(obj));

            const originalSceneAdd = scene.add;
            scene.add = function(...args) {
                const result = originalSceneAdd.apply(scene, args);
                trackObject(args[0]);
                return result;
            };
            
            const originalSceneRemove = scene.remove;
            scene.remove = function(...args) {
                untrackObject(args[0]);
                return originalSceneRemove.apply(scene, args);
            };

            const originalRender = window.renderer.render;
            window.renderer.render = function(...args) {
                checkTransform(); // Переименовал для ясности
                originalRender.apply(window.renderer, args);
            };

            console.log('Умный трекер трансформаций успешно инициализирован.');

        } else {
            setTimeout(waitForSceneReady, 250);
        }
    })();

})(window);