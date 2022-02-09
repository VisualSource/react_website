import GitHub from 'github-api';

let GIT_INSTANCE: null | GitHub = null;
export default class Git {
    static Instance(){
        if(GIT_INSTANCE) return GIT_INSTANCE;
        
        GIT_INSTANCE = new GitHub();

        return GIT_INSTANCE;
    }
    static async get_news_markdown(page: string): Promise<string> {
        const raw = await fetch(`${process.env.REACT_APP_NEWS}${page}.md`);
        const text = await raw.text();
        const markdown = await Git.Instance().getMarkdown().render({ "text":text });
        return markdown?.data ?? "";
    }
    static async get_repo_readme({repo, branch = "master", user = "VisualSource"}:{repo: string, branch: string, user: string}): Promise<string> {
        let instance = Git.Instance();
        const repos = await instance.getRepo(user,repo);
        const readme = await repos.getReadme(branch,true);
        const str = await instance.getMarkdown().render({ text: readme.data });
        return str?.data ?? "<div>No readme</div>";
    }
}