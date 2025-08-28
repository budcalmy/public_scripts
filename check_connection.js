(function(window) {
    'usestrictest';

    console.log('Start checking connection..');

    const TARGET_CONSTRUCTOR_NAMES = ['Cabinet_new', 'Bardesk_new', 'Shelve_new', 'Model_new', 'Shaft'];
    const foundConstructors = {};
    const checkResults = {
        connected: false,
        constructors: {},
    };

    function findConstructors() {
        TARGET_CONSTRUCTOR_NAMES.forEach(name => {
            if (foundConstructors[name]) return;
            
            if (typeof window[name] === 'function') {
                foundConstructors[name] = window[name];
                checkResults.constructors[name] = {
                    found: true,
                    type: 'function',
                    prototype: Object.keys(window[name].prototype || {}).slice(0, 5)
                };
                console.log(`Object: ${name}`);
            }
        });

        
        if (Object.keys(foundConstructors).length === TARGET_CONSTRUCTOR_NAMES.length) {
            clearInterval(constructorSearchInterval);
            checkResults.connected = true;
            console.log('Connection success');
        }
    }

    const constructorSearchInterval = setInterval(findConstructors, 500);

    setTimeout(() => {
        clearInterval(constructorSearchInterval);
    }, 10000);
})(window)