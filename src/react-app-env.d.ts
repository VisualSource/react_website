/// <reference types="react-scripts" />


declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_API: string;
        REACT_APP_ROOT: string;
        REACT_APP_AUTH0_DOMAIN: string;
        REACT_APP_AUTH0_CLIENT_ID: string;
        REACT_APP_AUTH0_AUDIENCE: string;
        REACT_APP_AUTH_GITHUB: string;
        REACT_APP_NEWS: string;
    }
}

declare module 'github-api' {
    export interface ReleasesItem {
        browser_download_url: string;
        content_type: string;
        created_at: string;
        download_count: number;
        id: number;
        label: string;
        name: string;
        node_id: string;
        url: string;
        size: number;
        state: string;
    }

    export interface Release {
        assets: ReleasesItem[],
        assets_url: string;
        author: {},
        body: string, 
        created_at: string,
        draft: boolean;
        html_url: string;
        id: number;
        name: string;
        node_id: string;
        prerelease: boolean;
        published_at: string;
        tag_name: string;
        tarball_url: string;
        target_commitish: string;
        upload_url: string;
        url: string;
        zipball_url: string;
    }

    interface Gist {}
    interface Issue {}
    interface Markdown {
        render: (options?: {text?: string, mode?: "markdown" | "gfm", context?: string}, cb?: Function) => Promise<any>
    }
    interface Organization {}
    interface Project {}
    interface RateLimit {}
    export interface Repository {
        getReadme: (ref: string, raw: boolean, cb?: Function) => Promise<any>;
        listReleases: (cb?: string) => Promise<{
            config:{},
            data: Release[],
            headers: {
                [key: string]: string
            },
            request: XMLHttpRequest,
            status: number, 
            statusText: string
        }>
    }
    interface User {}
    interface Search {}
    interface Team {}
    
    export default class GitHub {
        constructor(auth?: {username?: string, password?: string, token?: string} ,apiBase?: string);
        getGist(id?: string): Gist;
        getIssues(user: string, repo: string): Issue;
        getMarkdown(): Markdown;
        getOrganization(organization: string): Organization;
        getProject(id: string): Project;
        getRateLimit(): RateLimit;
        getRepo(user: string, repo: string): Repository; 
        getUser(user?: string): User;
        search(query: string): Search;
        getTeam(teamId: string): Team;
    }
}
