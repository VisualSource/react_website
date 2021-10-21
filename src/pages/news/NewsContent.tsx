import {useEffect,useState} from 'react';
import ReactHtmlParser from 'react-html-parser';
import Spinner from '../../components/Spinner';
import Git from '../../api/Github';

export default function NewsContent({page}: { page: string }){
    const [loading,setloading] = useState(true);
    const [markdown,setMarkdown] = useState("");

    useEffect(()=>{
        const init = async () => {
            try {
                const news = await Git.get_news_markdown(page);
                setMarkdown(news);
                setloading(false);
            } catch (error) {
                setMarkdown(`
                    <div className="vs-news-load-error">
                        <h1>There was an error when loading.</h1>
                    </div>
                `);
                setloading(false);
            }
        }
        init();
    },[page]);

    if(loading){
        return (
            <div className="vs-spinner-wrapper">
                <Spinner/>
            </div>
        )
    }

    return (
        <>
            {ReactHtmlParser(markdown)}
        </>
    );
}