(function () {
    function applyTheme(theme) {
        if (!theme || theme === 'none') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('app-theme', 'none');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('app-theme', theme);
        }
    }

    function init() {
        const selector = document.getElementById('themeSelector');
        const saved = localStorage.getItem('app-theme') || 'dark';
        if (saved === 'none') applyTheme('none');
        else applyTheme(saved);

        if (selector) {
            selector.value = saved;
            selector.addEventListener('change', function (e) {
                applyTheme(e.target.value);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
