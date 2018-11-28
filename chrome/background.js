chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('chrome/index.html', {
    'outerBounds': {
      'width': 640,
      'height': 400
    }
  });
});
