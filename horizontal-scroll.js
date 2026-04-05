// 为 DecideBox 添加鼠标滚轮横向滚动功能
(function() {
    'use strict';

    function initHorizontalScroll() {
        const decideBoxes = document.querySelectorAll('.DecideBox');
        
        decideBoxes.forEach(function(box) {
            box.addEventListener('wheel', function(e) {
                // 阻止默认的垂直滚动行为
                e.preventDefault();
                
                // 将垂直滚动转换为水平滚动
                const delta = e.deltaY || e.wheelDelta;
                this.scrollLeft += delta;
            }, { passive: false });
        });
    }

    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHorizontalScroll);
    } else {
        initHorizontalScroll();
    }

    // 暴露全局方法
    window.HorizontalScroll = {
        init: initHorizontalScroll
    };
})();
