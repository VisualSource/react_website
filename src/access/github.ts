import GitHub from 'github-api';
import CONFIG from '../config.json';

let instance = new GitHub({
    token: CONFIG.auth.github
});

export async function Markdown(repo: string = "website"){
    let get_repo = await instance.getRepo("VisualSource",repo);
    let readme = await get_repo.getReadme("master",true);
    return await instance.getMarkdown().render({"text": readme.data});
}