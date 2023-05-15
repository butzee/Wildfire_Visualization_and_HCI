d3.select('#rangeSlider').on('input', function() {
    update(this.value);
  });

  var myTimer;
  d3.select("#start").on("click", function() {
  clearInterval (myTimer);
    myTimer = setInterval (function() {
        var b= d3.select("#rangeSlider");
        var t = (+b.property("value") + 1) % (+b.property("max") + 1);
        if (t == 0) { t = +b.property("min"); }
        b.property("value", t);
        update (t);
      }, 100);
  });

  d3.select("#pause").on("click", function() {
    clearInterval (myTimer);
  });

  d3.select("#stop").on("click", function() {
    d3.select("#rangeSlider").property("value", 0);
  });