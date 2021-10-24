import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { Card } from 'react-bootstrap';

interface IGames {
  title: string;
  description: string;
  route: string;
  image: string;
}

export default function Games(){
    const [loading,setLoading] = useState<boolean>(true);
    const [content,setContent] = useState<IGames[]>([]);

    useEffect(()=>{
        const init = async () => {
            try {
                const raw = await fetch(`${process.env.REACT_APP_API}content/games`);
                const data: IGames[] = await raw.json();

                setContent(data);

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        init();
    },[]);

    if(loading) {
        return (
            <div className="loading-container">
                <Spinner/>
            </div>
        );
    }

    return (
        <div id="vs-games-list">
            {
                content.map((item,key)=>{
                    return (
                        <Card key={key} className="bg-dark text-light">
                            <Card.Header>
                                <Card.Title>{item.title}</Card.Title>
                            </Card.Header>
                            <Card.Img src={item.image}></Card.Img>
                            <Card.Body>
                                <Card.Text>
                                    {item.description}
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <a className="btn btn-primary" href={item.route}>Play</a>
                            </Card.Footer>
                        </Card>
                    );
                })
            }
        </div>
    );
}