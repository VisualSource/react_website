window.addEventListener('load',()=>{ 
    try {
      let get = document.querySelector("div > a[title]");
      get.style.display = "none";
    } catch (_) {}
});