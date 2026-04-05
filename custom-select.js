// 自定义下拉框组件
(function() {
    'use strict';

    // 初始化所有自定义下拉框
    function initCustomSelects() {
        const customSelects = document.querySelectorAll('.custom-select');
        
        customSelects.forEach(function(customSelect) {
            initCustomSelect(customSelect);
        });
    }

    // 初始化单个下拉框
    function initCustomSelect(customSelect) {
        const selectTrigger = customSelect.querySelector('.select-trigger');
        const selectedText = customSelect.querySelector('.selected-text');
        const options = customSelect.querySelectorAll('.option');

        if (!selectTrigger) return;

        // 点击触发器展开/收起下拉框
        selectTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            // 先关闭其他打开的下拉框
            closeAllSelects(customSelect);
            customSelect.classList.toggle('open');
        });

        // 点击选项
        options.forEach(function(option) {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // 更新选中的文本
                if (selectedText) {
                    selectedText.textContent = this.textContent;
                }
                
                // 更新选中状态
                options.forEach(function(opt) {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
                
                // 关闭下拉框
                customSelect.classList.remove('open');
                
                // 触发自定义事件
                const event = new CustomEvent('select:change', {
                    detail: {
                        value: this.dataset.value,
                        text: this.textContent,
                        select: customSelect
                    }
                });
                customSelect.dispatchEvent(event);
            });
        });
    }

    // 关闭所有下拉框（除了传入的元素）
    function closeAllSelects(except) {
        const openSelects = document.querySelectorAll('.custom-select.open');
        openSelects.forEach(function(select) {
            if (select !== except) {
                select.classList.remove('open');
            }
        });
    }

    // 点击外部关闭下拉框
    document.addEventListener('click', function() {
        closeAllSelects();
    });

    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCustomSelects);
    } else {
        initCustomSelects();
    }

    // 暴露全局 API
    window.CustomSelect = {
        init: initCustomSelects,
        initOne: initCustomSelect
    };
})();
