chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('chrome/window.html', {
    'outerBounds': {
      'width': 640,
      'height': 400
    }
  });
});
