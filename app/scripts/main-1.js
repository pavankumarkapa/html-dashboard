window.$(function() {
  function slideBeforeScan() {
    $('.a-slider').addClass('a-2');
    $('.a-slider').removeClass('a-3');
    $('.a-slider').removeClass('a-1');
    setTimeout(function() {
      doScan();
    }, 1000);
  }

  function doScan() {
    $('.a-scanner').addClass('scanner');
    setTimeout(function() {
      slideAfterScan();
    }, 1500);
  }

  function slideAfterScan() {
    $('.a-scanner').removeClass('scanner');
    $('.a-slider').addClass('a-3');
    $('.a-slider').removeClass('a-2');

    setTimeout(function() {
      cleanUp();
    }, 1000);
  }

  function cleanUp() {
    $('.a-slider').removeClass('a-3');
    $('.a-slider').addClass('a-1');

    setTimeout(function() {
      slideBeforeScan();
    }, 1000);
  }

  setTimeout(function() {
    slideBeforeScan();
  }, 1000);
});

$(function() {
  var i = 1;
  setInterval(function() {
    var prevClass = '.anim-' + (i - 1) + '> a';
    $('.ball').removeClass('ball-a-' + (i - 1) + '');
    if (i === 7) {
      i = 1;
    }
    var nextClass = '.anim-' + (i) + '> a';
    $(prevClass).removeClass('active');
    $(nextClass).addClass('active');
    $('.ball').addClass('ball-a-' + i + '');
    i++;
  }, 2000);
});
