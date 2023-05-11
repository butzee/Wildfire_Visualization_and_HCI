document.addEventListener("DOMContentLoaded", async () => {
    console.log("Render test");

    let rows = window.api.getShapes();
    rows.forEach(row => {
        console.log(row);
    });

    let divShapes = document.getElementById("data-container");
    //let shapeString = shapes.map((elem) => {
    //    return elem.shape;
    //}).join("<br />");
    let shapeString = shapes.join("<br />");
    divShapes.innerHTML = shapeString;

});
