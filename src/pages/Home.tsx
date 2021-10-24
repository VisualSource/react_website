import Particles from "react-tsparticles";
import {config} from '../api/PartialConfig';

export default function Home(){
    const particlesInit = (main: any) => {};
    const particlesLoaded = (container: any) => {};
    return (
        <div id="vs-home">
          <span>
            <h1 className="display-1">VisualSource</h1>
          </span>
          <Particles id="tsparticles" init={particlesInit} loaded={particlesLoaded} options={config}/>
        </div>
    );
}