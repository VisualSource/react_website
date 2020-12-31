import CONFIG from '../config.json';


function getCookie(cname: string) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
function setCookie(version: string){
    const d = new Date();
    d.setTime(d.getTime() + (7*24*60*60*1000));
    const expires = "expires="+ d.toUTCString();
    document.cookie = "content" + "=" + version + ";" + expires + ";path=/";
}
async function fetchContent(){
  try {
      const data =  await (await fetch(CONFIG.db)).json();
      window.localStorage.setItem("projects",JSON.stringify(data.posts));
      setCookie("1.0.0");
  } catch (error) {
      console.error("Failed to update content.");
  }
}

export default async function CheckContent(){
    const cookie = getCookie('content');
    if (cookie === ""){
      fetchContent();
    }
}