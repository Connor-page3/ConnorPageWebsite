$(window).scroll(function() {
  var blurVal;
  blurVal = $(window).scrollTop() / 150;
  return $(".photo-blur").css("opacity", blurVal);
});