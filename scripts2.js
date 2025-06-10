/* document.addEventListener("DOMContentLoaded", ()=>{
    const gameWrapper = document.querySelector(".gameWrapper");
    for (let idx = 0; idx < 9; idx++) {
        let newCell = document.createElement("div");
        let i = Math.floor(idx/3);
        let j = idx % 3;
        if (i < 2) {
            newCell.style.borderBottom = "2px solid black";
        }

        if (i > 0) {
            newCell.style.borderTop = "2px solid black";
        }

        if (j < 2) {
            newCell.style.borderRight = "2px solid black";
        }

        if (j > 0) {
            newCell.style.borderLeft = "2px solid black";
        }

        newCell.addEventListener("click", ()=>{
            newCell.textContent=`${idx}`;
        })
        gameWrapper.appendChild(newCell);
    }  
}); */