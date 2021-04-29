import GitHub from 'github-api';

let instance = new GitHub({
    token: process.env.REACT_APP_AUTH_GITHUB
});

export async function NewsMarkdown(page = "webiste") {
    const raw = await fetch(`https://raw.githubusercontent.com/VisualSource/react_website/master/news/${page}.md`);
    const text = await raw.text();
    return await instance.getMarkdown().render({"text":text});
}

export async function Markdown(repo: string = "website"){
    let get_repo = await instance.getRepo("VisualSource",repo);
    let readme = await get_repo.getReadme("master",true);
    return await instance.getMarkdown().render({"text": readme.data});
}