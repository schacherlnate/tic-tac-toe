let gameWrapper = document.querySelector(".gameWrapper");
for (let idx = 0; idx < 9; idx++) {
    const newCell = document.createElement("div");
    const i = Math.round(idx/3);
    const j = idx % 3;
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
}