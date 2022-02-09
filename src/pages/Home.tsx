import Particles from "react-tsparticles";
import {config} from '../api/PartialConfig';

export default function Home(){
    const particlesInit = async (main: any): Promise<void> => {};
    const particlesLoaded = async (container: any): Promise<void> => {};
    return (
        <div id="vs-home">
          <span>
            <h1 className="display-1">VisualSource</h1>
          </span>
          <Particles id="tsparticles" init={particlesInit} loaded={particlesLoaded} options={config}/>
        </div>
    );
}