import CONFIG from '../config.json';

type DBSource = "posts" | "profile" | "comments" | "db";

/**
 * Handle cookie operations
 */
const cookieHandler = {
    getCookie(cname: string): string | null {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
          }
        }
        return null;
      },
    setCookie(version: string){
        const d = new Date();
        d.setTime(d.getTime() + (7*24*60*60*1000));
        const expires = "expires="+ d.toUTCString();
        document.cookie = "content" + "=" + version + ";" + expires + ";SameSite=Lax;path=/";
    }
}

/**
 * Fetch the content from database.
 *
 * @return {*}  {Promise<any>}
 */
 async function loadContent(path: DBSource = "db"): Promise<any> {
    try {
        const content = await fetch(`${CONFIG.db}/${path}`);
        const parsed = await content.json();
        return parsed;
    } catch (error) {
        throw new Error("database fetching error");
    }
}

/**
 * sets content to localstronge, content is Stringifed
 *
 * @param {string} item
 * @param {*} content
 */
function setContent(item: string, content: any): void{
    window.localStorage.removeItem(item);
    window.localStorage.setItem(item,JSON.stringify(content));
}

/**
 * Check for content updates and 
 *
 * @export
 */
export async function ContentVersionChecker(): Promise<void> {
    const cookie = cookieHandler.getCookie('content');
    if(cookie === null){
        try {
            const content = await loadContent();
            cookieHandler.setCookie(content.profile.version);
            setContent("projects",content.posts);
            setContent("games",content.comments.games);
        } catch (error) {
            console.error(error);
        }
    }
}


/**
 * Check if content is in localstroage else fetch data from database.
 *
 * @export
 * @param {string} [item="projects"]
 * @param {(data: any)=>void} handler apon data loaded this function is called to act apon it
 * @return {*}  {Promise<any>}
 */
export async function fetchContent(item: string = "projects", src: DBSource = "db"): Promise<any> {
    try {
        const content = window.localStorage.getItem(item);
        if(content === null){
            const db = await loadContent(src);
            setContent(item,db);
            return db;
        }
        const parsed = JSON.parse(content);
        return parsed;
    } catch (error) {
        console.error(error);
    }
}