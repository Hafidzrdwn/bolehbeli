;(function () {
  try {
    var m = localStorage.getItem('boleh-beli:theme') || 'auto'
    var dark = m === 'dark' || (m !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
  } catch (e) {}
})()
