export default function MCServer(){
    return (
        <div>
            <div>
                <h2>Server Status</h2>
                <span>
                    <img src="" alt="server icon" />
                </span>
                <p>Server MOTD</p>
                <div>
                    <h5>Players 0/0</h5>
                    <ul>
                        <li>VisualSource</li>
                    </ul>
                </div>
            </div>
            <div>
                <img src="" alt="map-overview" />
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        View Dimension
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a className="dropdown-item" href="#overworld">Overworld</a></li>
                        <li><a className="dropdown-item" href="#nether">Nether</a></li>
                        <li><a className="dropdown-item" href="#end">The End</a></li>
                        <li><a className="dropdown-item" href="#aether">Aether</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}