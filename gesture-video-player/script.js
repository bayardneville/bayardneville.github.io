//
// Startup
//
var selected = false;
var _isDown, _points, _r, _g, _rc;
var useProtractor = true;
var grayColor = "#ccc";
var blueColor = "#222";
var orangeColor = "#26c";
function resizeCanvas() {
  var canvas = document.getElementById('myCanvas');
  canvas.width = document.body.clientWidth > window.innerWidth ? document.body.clientWidth : window.innerWidth;
  canvas.height = document.body.clientHeight > window.innerHeight ? document.body.clientHeight : window.innerHeight;
}
function onLoadEvent() {
  _points = new Array();
  _r = new DollarRecognizer();

  var canvas = document.getElementById('myCanvas');
  resizeCanvas();
  _g = canvas.getContext('2d');
  _g.fillStyle = orangeColor;
  _g.strokeStyle = orangeColor;
  _g.lineWidth = 3;
  _g.font = "16px Helvetica Neue, Helvetica, sans-serif";
  _rc = getCanvasRect(canvas); // canvas rect on page

  _isDown = false;
  $("#players").css("padding-top", $("#statusbar").height());
}
function getCanvasRect(canvas) {
  var w = canvas.width;
  var h = canvas.height;

  var cx = canvas.offsetLeft;
  var cy = canvas.offsetTop;
  while (canvas.offsetParent != null)
  {
    canvas = canvas.offsetParent;
    cx += canvas.offsetLeft;
    cy += canvas.offsetTop;
  }
  return {x: cx, y: cy, width: w, height: h};
}
function getScrollY() {
  var scrollY = $(window).scrollTop();
  return scrollY;
}
//
// Mouse Events
//
function mouseDownEvent(x, y) {
  document.onselectstart = function() { return false; } // disable drag-select
  document.onmousedown = function() { return false; } // disable drag-select
  _isDown = true;
  x -= _rc.x;
  y -= _rc.y - getScrollY();
  if (_points.length > 0)
    _g.clearRect(0, 0, _rc.width, _rc.height);
  _points.length = 1; // clear
  _points[0] = new Point(x, y);
  drawText("Recording gesture...");
  _g.fillStyle = orangeColor;
  _g.fillRect(x - 4, y - 3, 9, 9);
}
function mouseMoveEvent(x, y) {
  if (_isDown) {
    x -= _rc.x;
    y -= _rc.y - getScrollY();
    _points[_points.length] = new Point(x, y); // append
    drawConnectedPoint(_points.length - 2, _points.length - 1);
  }
}
function mouseUpEvent(x, y) {
  document.onselectstart = function() { return true; } // enable drag-select
  document.onmousedown = function() { return true; } // enable drag-select
  if (_isDown) {
    _isDown = false;
    if (_points.length >= 10) {
      var result = _r.Recognize(_points, useProtractor);
      handleResult(result, _points[0]);
    }
    else { // fewer than 10 points were inputted
      drawText("Please try a larger gesture");
    }
  }
}
function drawConnectedPoint(from, to) {
  _g.beginPath();
  _g.moveTo(_points[from].X, _points[from].Y);
  _g.lineTo(_points[to].X, _points[to].Y);
  _g.closePath();
  _g.stroke();
}
function round(n, d) { // round 'n' to 'd' decimals
  d = Math.pow(10, d);
  return Math.round(n * d) / d
}
//
// Functions for updating the status bar
//
function drawText(str) {
  $("#status").text(str);
}
function drawSelected() {
  $("#selected").text(selected ? "all videos (unless it is \"add\")" : "one video");
}
function showGestures() {
  var help = $("#help");
  help.css("display", help.css("display") == "none" ? "block" : "none");
  $("#players").css("padding-top", $("#statusbar").height());
}
//
// Functions for handling recognized gestures
//
function handleResult(result, start) {
  var video = getVideoAt(start);
  try {
    switch(result.Name) {
      case "select":
        selected = !selected;
        drawText("All videos " + (selected ? "selected (repeat \"select\" to deselect)" : "unselected" ));
        drawSelected();
        break;
      case "add":
        drawText("Added one video");
        addPlayer();
        selected = false;
        drawSelected();
        break;
      case "remove":
        drawText("Removed " + (selected ? "all videos" : "one video"));
        selected ? forAll(remove) : remove(video);
        break;
      case "play":
        drawText("Play/paused " + (selected ? "all videos" : "one video"));
        selected ? forAll(play) : play(video);
        break;
      case "forward":
        drawText("Skipped forward in " + (selected ? "all videos" : "one video"));
        selected ? forAll(forward) : forward(video);
        break;
      case "back":
        drawText("Skipped back in " + (selected ? "all videos" : "one video"));
        selected ? forAll(back) : back(video);
        break;
      case "louder":
        drawText("Raised volume for " + (selected ? "all videos" : "one video"));
        selected ? forAll(louder) : louder(video);
        break;
      case "quieter":
        drawText("Lowered volume for " + (selected ? "all videos" : "one video"));
        selected ? forAll(quieter) : quieter(video);
        break;
      case "faster":
        drawText("Sped up " + (selected ? "all videos" : "one video"));
        selected ? forAll(faster) : faster(video);
        break;
      case "slower":
        drawText("Slowed down " + (selected ? "all videos" : "one video"));
        selected ? forAll(slower) : slower(video);
        break;
      case "resize":
        drawText("Toggled size for " + (selected ? "all videos" : "one video"));
        selected ? forAll(resize) : resize(video);
        break;
      case "mute":
        drawText("Muted/unmuted " + (selected ? "all videos" : "one video"));
        selected ? forAll(mute) : mute(video);
        break;
    }
  } catch(err) {
    drawText("Gesture \"" + result.Name + "\" must start in a video or be preceded by \"select\"");
  }
}
function forAll(action) {
  var didNothing = true;
  $.each($("#players > video"), function() {
    action(this);
    didNothing = false;
  });
  if(didNothing) {
    drawText("No videos exist. Please add a video first");
  }
  selected = false;
  drawSelected();
}
function getVideoAt(point) {
  var video;
  $.each($("#players > video"), function() {
    var offset = $(this).offset();
    var x1 = offset.left;
    var x2 = x1 + $(this).width();
    var y1 = offset.top;
    var y2 = y1 + $(this).height();
    if(x1 <= point.X && point.X < x2 && y1 <= point.Y && point.Y < y2) {
      video = this;
      return false;
    }
  });
  return video;
}
function addPlayer() {
  $("#players").append($("<video preload='none' mediagroup='myVideoGroup' poster='thumbnail.png' style='width: 50%'>")
               .append($("<source id='mp4' src='https://vp.nyt.com/video/2016/10/17/43343_1_tmag-massimo_wg_1080p.mp4' type='video/mp4'>")));
  onLoadEvent(); // Fixes canvas if page got longer
}
function remove(video) {
  video.remove();
  onLoadEvent();
}
function play(video) {
  if(video.paused) {
    video.play();
  } else {
    video.pause();
  }
}
function forward(video) {
  video.currentTime += 10;
}
function back(video) {
  video.currentTime -= 10;
}
function louder(video) {
  if(video.volume <= .75) {
    video.volume += .25;
  } else {
    video.volume = 1;
  }
}
function quieter(video) {
  if(video.volume >= .25) {
    video.volume -= .25;
  } else {
    video.volume = 0;
  }
}
function faster(video) {
  video.playbackRate += .25;
}
function slower(video) {
  video.playbackRate -= .25;
}
function resize(video) {
  if(video.style.width == "50%") {
    video.style.width = "100%";
  } else {
    video.style.width = "50%";
  }
  onLoadEvent(); // Fixes canvas if page got longer
}
function mute(video) {
  video.muted = !video.muted;
}
