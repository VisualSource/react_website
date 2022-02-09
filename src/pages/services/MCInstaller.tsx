import { useEffect, useState } from "react";
import { Container, Table } from 'react-bootstrap';
import Git from "../../api/Github";
import ReactHtmlParser from 'react-html-parser';
import Spinner from "../../components/Spinner";
import type { Release } from 'github-api';

export default function MCInstaller(){
    const [loading,setLoading] = useState<boolean>(true);
    const [markdown,setMarkdown] = useState<string>("");
    const [downloads,setDownloads] = useState<Release[]>([]);

    useEffect(()=>{
        const init = async () => {
            try {
                const repo = Git.Instance().getRepo("VisualSource","mc-installer");
                const releases = await repo.listReleases();
                setDownloads(releases.data);
            } catch (error) {
                console.error(error);
            }
            try {
                const readme = await Git.get_repo_readme({repo:"mc-installer",branch:"main",user:"VisualSource"});
                setMarkdown(readme);
            } catch (error) {
                console.error(error);
                setMarkdown("<div>Failed to load readme</div>");
            }

            setLoading(false);
        }
        init();
    },[]);

    if(loading){
        return (
            <div className="vs-spinner-wrapper">
                <Spinner/>
            </div>
        );
    }

    return (
        <Container id="minecraft-launcher">
            <header>
                <h1>Rusty Minecraft Launcher</h1>
                <img src="/images/mc_installer.webp" alt="header"/>
            </header>
            <div>
                <h2>Links</h2>
                <ul>
                    <li><a href="#downloads">Downloads</a></li>
                    <li><a href="#whatisthis">What is This?</a></li>
                </ul>
            </div>
            <article className="markdown-body" id="whatisthis">
                {ReactHtmlParser(markdown)}
            </article>
            <div id="downloads">
                <h2>Downloads</h2>
                <p>Latest Current Version: {downloads[0].tag_name}</p>
                <p>Download the Rusty Minecraft launcher source code or a pre-built installer</p>
                <div id="quick-download">
                    <div id="quick-description">
                        <h3>Current</h3>
                        <span>Latest Features</span>
                    </div>
                    <div id="latest">
                        <a href={downloads[0].assets[1].browser_download_url}>
                            <svg className="download-logo" width="50" height="50" viewBox="0 0 50 50" focusable="false">
                                <path d="M1.589 23.55L1.572 8.24l18.839-2.558V23.55zM23.55 5.225l25.112-3.654V23.55H23.55zM48.669 26.69l-.006 21.979-25.112-3.533V26.69zM20.41 44.736l-18.824-2.58-.001-15.466H20.41z"></path>
                            </svg>
                            <h6>Windows</h6>
                        </a>
                        <a href={downloads[0].tarball_url}>
                            <svg className="download-logo" width="50" height="50" viewBox="0 0 50 50" focusable="false"><path d="M25.03.934L.159 11.65l24.895 10.632 25.152-10.656L25.03.935zm1.02 22.686v25.686l24.188-11.483V13.345L26.05 23.62zM.001 37.824l24.27 11.483V23.621L.001 13.346v24.478z"></path></svg>
                            <h6>Source Code</h6>
                        </a>
                    </div>
                </div>

                <h3>Past Versions</h3>
                <details>
                    <summary className="bg-dark text-light">View</summary>
                    <Table striped bordered hover variant="dark" id="past-versions">
                        <thead> 
                            <tr>
                                <th>Version</th>
                                <th>Windows</th>
                                <th>Source Code</th>
                                <th>Published</th>
                            </tr>
                        </thead>
                        <tbody>
                        {downloads.map((download,i)=>{
                            return (<tr key={i}>
                                <td>{download.tag_name}</td>
                                <td><a href={download.assets[1].browser_download_url}>{download.assets[1].name}</a></td>
                                    <td><a href={download.tarball_url}>Source code</a></td>
                                    <td>{download.published_at}</td>
                            </tr>);
                        })}
                        </tbody>
                    </Table>
                </details>
            </div>
        </Container>
    );
}

/*<details id="past-versions">
                    <summary>View</summary>
                    <Table striped bordered hover variant="dark">
                        <thead> 
                            <tr>
                                <th>Version</th>
                                <th>Windows</th>
                                <th>Source Code</th>
                                <th>Published</th>
                            </tr>
                        </thead>
                        <tbody>
                           {
                               downloads.map((download,i)=>{
                                   return (
                                    <tr>
                                        <td>{download.tag_name}</td>
                                        <td><a href={download.assets[1].browser_download_url}>{download.assets[1].name}</a></td>
                                        <td><a href={download.tarball_url}>Source code</a></td>
                                        <td>{download.published_at}</td>
                                    </tr>
                                   );
                               })
                           }
                        </tbody>
                    </Table>
                </details>
 */