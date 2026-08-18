var index = 0;
function tip(content, time = 2000,color){
    console.log("[tip]", content);
    var tipList = document.querySelector('.tipList');
    var tipView = document.createElement('div');
    tipView.id = index;
    tipView.classList.add('tipView');
    tipView.style.top = index*50 + 'px';
    tipView.innerHTML = '<div></div><p>' + content + '</p>';
    tipView.style.borderLeftColor = color;
    tipView.querySelector('div').style.backgroundColor = color;
    tipList.appendChild(tipView); 
    index++;
    setTimeout(function(){
        tipView.style.transform = 'translateX(0)';
        
    }, 50);
    setTimeout(function(){
        index--;
        document.querySelectorAll('.tipView').forEach(item => {
            item.style.top = (parseInt(item.style.top.substring(0, item.style.top.length - 2)) - 50) + 'px';
            
        });
        tipView.style.transform = 'translateX(100%)';
        setTimeout(function(){
            tipView.remove();
        }, 400);
    }, time);
}
