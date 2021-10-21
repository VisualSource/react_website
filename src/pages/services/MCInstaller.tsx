import { useEffect, useState } from "react";
import Git from "../../api/Github";
import ReactHtmlParser from 'react-html-parser';

export default function MCInstaller(){
    const [loading,setLoading] = useState<boolean>(true);
    const [markdown,setMarkdown] = useState<string>("");
    const [downloadUrl,setDownloadUri] = useState<string>("#download");

    useEffect(()=>{
        const init = async () => {
            try {
                const repo = Git.Instance().getRepo("VisualSource","mc-installer");
                const releases = await repo.listReleases();
                const assets = releases.data[0].assets[1].browser_download_url;
                setDownloadUri(assets);
            } catch (error) {
                
            }
           try {
                const readme = await Git.get_repo_readme({repo:"mc-installer",branch:"main",user:"VisualSource"});
                setMarkdown(readme);
           } catch (error) {
                setMarkdown("<div>Failed to load readme</div>");
           }

           setLoading(false);
        }
        init();
    },[]);

    return (
        <div>
            <article className="markdown-body">
                    {ReactHtmlParser(markdown)}
            </article>
            <div>
                <h4>Download</h4>
                <a href={downloadUrl} className="btn btn-secondary">Download</a>
            </div>
        </div>
    );
}