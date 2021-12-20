import { Card } from 'react-bootstrap';

interface IResouceCardProps {
    id: number;
    name: string;
    description: string;
    type: "datapack" | "mod" | "plugin" | "resourcepack";
    state: "admited" | "rejected" | "active" | "removed";
    links: { link: string, name: string }[];
    required: number[];
    complieteData: any[];
}

const typeColor = {
    "datapack": "text-indigo",
    "mod": "text-cyan",
    "plugin": "text-purple",
    "resourcepack": "text-red"
}

const stateColor = {
    "admited": "text-warning",
    "rejected": "text-danger",
    "active": "text-success",
    "removed": "text-info"
}

export default function ResourceCard({ id, name, description, type, state, links, required, complieteData }: IResouceCardProps ){
    return (
        <Card id={`${id}-${encodeURI(name)}`} bg="dark" text="light">
            <Card.Header>
                {name} | ID: {id}
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    {description}
                </Card.Text>
            </Card.Body>
           <Card.Footer className="text-muted">
                Type: <span className={typeColor[type]}>{type}</span>
                <br/>
                State: <span className={stateColor[state]}>{state} </span>
                <div className="vs-card-links">
                    {links.map((link,key)=>{
                        return (
                            <a key={key} href={link.link}>
                                <img src={`https://img.shields.io/badge/Link-${encodeURI(link.name)}-blue?style=flat-square&cacheSeconds=31536000`} alt="external link" />
                            </a>
                        );
                    })}
                    {required.map((required,key)=>{
                        const requiredPack = complieteData.find(({id}) => id === required);
                            return (
                                <a key={key} href={`#${requiredPack?.id ?? 0}-${encodeURI(requiredPack?.name ?? "")}`}>
                                    <img src={`https://img.shields.io/badge/Required-${encodeURI(requiredPack?.name ?? "Required Item")}-red?style=flat-square&cacheSeconds=31536000`} alt="required item link" />
                                </a>
                            );
                    })}
                </div>
            </Card.Footer>
        </Card>
    );
}