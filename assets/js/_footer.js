
let footer = document.querySelector('.footer');
let bgUrl = footer.getAttribute('data-backgroundUrl');

// changing background style of footer
footer.style.background = `url(${bgUrl}) no-repeat`;
footer.style.backgroundSize= "cover";
    
footer.style.backgroundPositionX= "center";
footer.style.backgroundPositionY= "bottom";
  