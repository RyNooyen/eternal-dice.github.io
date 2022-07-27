function createTextPopupParticle(text,x,y,up=false) {
    var newPopup = document.createElement("div")
    newPopup.className = "popup_text"
    newPopup.innerHTML = text

    newPopup.style.top = y + "px"
    newPopup.style.left = x + "px"

    if (up) newPopup.style.animationName = "text_popup_up"

    //newPopup.style.ani =

    document.getElementById("popup_text").appendChild(newPopup)

    setTimeout(_=>{
        newPopup.remove()
    },2000)
}

function progCheck(x) {
    var temp = Math.floor(data[x].min_s_prog/(Math.floor(data[x].min_s/100)+1))
    data[x].min_s_prog -= temp
    data[x].min_s += temp
    temp = Math.floor(data[x].max_s_prog/(Math.floor(data[x].max_s/100)+1))
    data[x].max_s_prog -= temp
    data[x].max_s += temp
}
