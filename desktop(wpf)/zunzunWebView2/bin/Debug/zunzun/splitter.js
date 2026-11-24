/* 电脑端（WebView2）视图分隔条：拖动调整相邻视图的宽度/高度
 * - 只在 WebView2 套壳 + 精确指针（鼠标）环境生效；手机/触屏端完全不激活
 * - 分隔条插入在 #mainView 里相邻的可见视图之间，行布局调宽度、列布局调高度
 * - 每块都有最小尺寸与最大占比，窗口缩放时按比例重新夹取
 * - 切换模式、折叠面板、横竖屏切换时恢复默认比例并重建分隔条
 */
(function () {
    'use strict';

    if (window.isWebView2Desktop !== true) { return; }
    if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) { return; }

    var mainView = document.getElementById('mainView');
    if (!mainView) { return; }

    var PANE_IDS = ['canvasView', 'bqbView', 'setView', 'lipView'];
    var SPLITTER_CLASS = 'paneSplitter';
    var MAX_FRACTION = 0.72;   // 单块最多占可用空间的 72%，避免把其它块挤没
    var MIN_EDGE = 60;         // 折叠后面板的判定高度（竖向）
    var HANDLE = 8;            // 分隔条命中宽度
    var GAP_HALF = 9;          // 与 #mainView 的 10px gap 对齐，让分隔条正好落在空隙里

    var style = document.createElement('style');
    style.textContent = [
        '.' + SPLITTER_CLASS + '{flex:0 0 ' + HANDLE + 'px;align-self:stretch;background:transparent;',
        '  position:relative;z-index:5;transition:background-color .12s ease;}',
        '.' + SPLITTER_CLASS + '.row{cursor:col-resize;margin:0 -' + GAP_HALF + 'px;}',
        '.' + SPLITTER_CLASS + '.column{cursor:row-resize;margin:-' + GAP_HALF + 'px 0;}',
        '.' + SPLITTER_CLASS + ':hover{background-color:rgba(67,160,71,.18);}',
        // 面板自带 transition:all .4s，拖动时会让宽度慢慢追，必须临时关掉
        '#mainView > .paneSplitterManaged{transition:none !important;}',
        'body.paneSplitterDragging{user-select:none !important;',
        '  -webkit-user-select:none !important;}'
    ].join('\n');
    document.head.appendChild(style);

    var orient = 'row';
    var activeEls = [];
    var sizes = {};        // id -> 主轴像素尺寸
    var applied = {};      // id -> 我们写入的 style.flex 值（用于区分自身写入与外部变化）
    var splitters = [];
    var drag = null;
    var suppress = false;
    var resetTimer = null;
    var fitTimer = null;

    function gcs(el) { return window.getComputedStyle(el); }
    function isVisible(el) { return !!el && gcs(el).display !== 'none'; }
    function mainSize(el) { return orient === 'row' ? el.offsetWidth : el.offsetHeight; }
    function byId(id) { return document.getElementById(id); }

    // 面板被用户折叠：表情包/朗读设置用 dataset.paneCollapsed 标记，素材区用 setViewCollapsed
    function isCollapsed(el) {
        if (el.classList && el.classList.contains('setViewCollapsed')) { return true; }
        return el.dataset ? el.dataset.paneCollapsed === '1' : false;
    }

    function orientNow() {
        return gcs(mainView).flexDirection === 'column' ? 'column' : 'row';
    }

    function gapPx() {
        var cs = gcs(mainView);
        var v = orient === 'row' ? cs.columnGap : cs.rowGap;
        var n = parseFloat(v);
        return isNaN(n) ? 0 : n;
    }

    function innerMain() {
        var cs = gcs(mainView);
        var pad = orient === 'row'
            ? parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
            : parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
        if (isNaN(pad)) { pad = 0; }
        return (orient === 'row' ? mainView.clientWidth : mainView.clientHeight) - pad;
    }

    function minSize(el) {
        if (el.id === 'canvasView') { return orient === 'row' ? 200 : 150; }
        return orient === 'row' ? 170 : 110;
    }

    // 可见但不可拖动的面板（折叠态）占用的主轴尺寸
    function fixedSize() {
        var total = 0;
        for (var i = 0; i < PANE_IDS.length; i++) {
            var el = byId(PANE_IDS[i]);
            if (!el || !isVisible(el)) { continue; }
            if (activeEls.indexOf(el) !== -1) { continue; }
            total += mainSize(el);
        }
        return total;
    }

    function freeSpace() {
        var n = activeEls.length;
        if (n < 2) { return 0; }
        return innerMain() - gapPx() * (n - 1) - fixedSize();
    }

    function applySize(el, px) {
        if (!isFinite(px)) { return; }
        // 关掉面板自带的 transition:all，否则拖动时尺寸会滞后追赶
        el.classList.add('paneSplitterManaged');
        // 用显式宽/高 + flex:0 0 auto 定尺寸，避开 flex-basis 百分比/收缩带来的偏差
        if (orient === 'row') {
            el.style.width = (Math.round(px * 100) / 100) + 'px';
            el.style.height = '';
        } else {
            el.style.height = (Math.round(px * 100) / 100) + 'px';
            el.style.width = '';
        }
        el.style.flex = '0 0 auto';
        applied[el.id] = el.style.flex;
    }

    function deactivate() {
        for (var i = 0; i < splitters.length; i++) {
            if (splitters[i].parentNode) { splitters[i].parentNode.removeChild(splitters[i]); }
        }
        splitters = [];
        Object.keys(applied).forEach(function (id) {
            var el = byId(id);
            if (!el) { return; }
            el.style.width = '';
            el.style.height = '';
            // 只还原仍是我们写入的 flex；用户折叠改过的保持不动
            if (el.style.flex === applied[id]) { el.style.flex = ''; }
            // 先清尺寸再恢复过渡，避免还原时出现回弹动画
            el.classList.remove('paneSplitterManaged');
        });
        applied = {};
        sizes = {};
        activeEls = [];
    }

    // 按当前可用空间重算尺寸：scale=true 时按比例缩放（窗口尺寸变化），
    // 否则只把初始测量值对齐到可用空间
    function fit(scale) {
        var n = activeEls.length;
        if (n < 2) { return; }
        var free = freeSpace();
        var mins = activeEls.map(minSize);
        var minTotal = mins.reduce(function (a, b) { return a + b; }, 0);
        if (free < minTotal) {
            // 空间不足：撤掉分隔条，恢复默认比例，避免异常/卡死
            resetLayout();
            return;
        }
        var ids = activeEls.map(function (el) { return el.id; });
        if (scale) {
            var total = 0;
            ids.forEach(function (id) { total += sizes[id] || 0; });
            if (total > 0) {
                var k = free / total;
                ids.forEach(function (id, i) {
                    sizes[id] = Math.max(mins[i], (sizes[id] || 0) * k);
                });
            }
        }
        // 夹取最大值
        var maxEach = free * MAX_FRACTION;
        ids.forEach(function (id, i) {
            sizes[id] = Math.min(sizes[id], maxEach);
            sizes[id] = Math.max(sizes[id], mins[i]);
        });
        // 把剩余误差补给有空余的面板，保证填满且不越界
        var diff = free - ids.reduce(function (a, id) { return a + sizes[id]; }, 0);
        for (var i = ids.length - 1; i >= 0 && Math.abs(diff) > 0.5; i--) {
            var id = ids[i];
            var lo = mins[i];
            var hi = maxEach;
            var target = Math.max(lo, Math.min(hi, sizes[id] + diff));
            diff -= target - sizes[id];
            sizes[id] = target;
        }
        activeEls.forEach(function (el, i) {
            if (!isFinite(sizes[el.id])) { sizes[el.id] = mins[i]; }
            applySize(el, sizes[el.id]);
        });
    }

    function makeDrag(index) {
        return function (ev) {
            if (ev.button !== 0 || drag) { return; }
            ev.preventDefault();
            var a = activeEls[index];
            var b = activeEls[index + 1];
            if (!a || !b) { return; }
            var free = freeSpace();
            var pair = sizes[a.id] + sizes[b.id];
            var maxA = Math.min(pair - minSize(b), free * MAX_FRACTION);
            var maxB = Math.min(pair - minSize(a), free * MAX_FRACTION);
            if (maxA < minSize(a) || maxB < minSize(b)) { return; }
            drag = {
                a: a, b: b,
                start: orient === 'row' ? ev.clientX : ev.clientY,
                a0: sizes[a.id], b0: sizes[b.id],
                minA: minSize(a), minB: minSize(b),
                maxA: maxA, maxB: maxB
            };
            document.body.classList.add('paneSplitterDragging');
            document.body.style.cursor = orient === 'row' ? 'col-resize' : 'row-resize';
            window.addEventListener('mousemove', onDragMove);
            window.addEventListener('mouseup', onDragEnd);
            window.addEventListener('blur', onDragEnd);
        };
    }

    function onDragMove(ev) {
        if (!drag) { return; }
        var pos = orient === 'row' ? ev.clientX : ev.clientY;
        var delta = pos - drag.start;
        var newA = Math.max(drag.minA, Math.min(drag.maxA, drag.a0 + delta));
        var newB = drag.a0 + drag.b0 - newA;
        if (newB > drag.maxB) { newB = drag.maxB; newA = drag.a0 + drag.b0 - newB; }
        if (newB < drag.minB) { newB = drag.minB; newA = drag.a0 + drag.b0 - newB; }
        sizes[drag.a.id] = newA;
        sizes[drag.b.id] = newB;
        applySize(drag.a, newA);
        applySize(drag.b, newB);
    }

    function onDragEnd() {
        if (!drag) { return; }
        drag = null;
        document.body.classList.remove('paneSplitterDragging');
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', onDragMove);
        window.removeEventListener('mouseup', onDragEnd);
        window.removeEventListener('blur', onDragEnd);
    }

    function activate() {
        orient = orientNow();
        activeEls = [];
        sizes = {};
        for (var i = 0; i < PANE_IDS.length; i++) {
            var el = byId(PANE_IDS[i]);
            if (!el || !isVisible(el) || isCollapsed(el)) { continue; }
            activeEls.push(el);
            sizes[el.id] = mainSize(el);
        }
        if (activeEls.length < 2) { return; }

        var free = freeSpace();
        var minTotal = activeEls.reduce(function (a, el) { return a + minSize(el); }, 0);
        if (free < minTotal) { return; }

        for (var j = 0; j < activeEls.length - 1; j++) {
            var sp = document.createElement('div');
            sp.className = SPLITTER_CLASS + (orient === 'row' ? ' row' : ' column');
            sp.title = orient === 'row' ? '拖动调整宽度' : '拖动调整高度';
            mainView.insertBefore(sp, activeEls[j + 1]);
            sp.addEventListener('mousedown', makeDrag(j));
            splitters.push(sp);
        }
        fit(false);
    }

    function resetLayout() {
        suppress = true;
        deactivate();
        activate();
        window.setTimeout(function () { suppress = false; }, 0);
    }

    function scheduleReset() {
        if (suppress) { return; }
        if (resetTimer) { window.clearTimeout(resetTimer); }
        resetTimer = window.setTimeout(function () {
            resetTimer = null;
            resetLayout();
        }, 60);
    }

    // 供 switchMode / 折叠开关在结构变化后主动刷新（比 MutationObserver 更可控）
    window.refreshPaneSplitters = function () {
        if (suppress) { return; }
        if (resetTimer) { window.clearTimeout(resetTimer); }
        resetTimer = window.setTimeout(function () {
            resetTimer = null;
            resetLayout();
        }, 30);
    };

    // 调试/自动化验证用：返回当前托管状态
    window.__paneSplitterDebug = function () {
        return {
            orient: orient,
            active: activeEls.map(function (el) { return el.id; }),
            sizes: JSON.parse(JSON.stringify(sizes)),
            free: freeSpace()
        };
    };

    window.addEventListener('resize', function () {
        if (fitTimer) { window.clearTimeout(fitTimer); }
        fitTimer = window.setTimeout(function () {
            fitTimer = null;
            if (activeEls.length >= 2) { fit(true); }
        }, 100);
    });

    var mql = window.matchMedia('(max-width: 768px)');
    if (mql.addEventListener) {
        mql.addEventListener('change', function () { scheduleReset(); });
    } else if (mql.addListener) {
        mql.addListener(function () { scheduleReset(); });
    }

    resetLayout();
})();
