import Particles, {RecursivePartial, IOptions} from "react-tsparticles";

const config: RecursivePartial<IOptions> = {
    background: {
        color: {
            value: "#0d1117",
        },
    },
    fpsLimit: 60,
    interactivity: {
        detectsOn: "canvas",
        events: {
            onClick: {
                enable: false,
                mode: "push",
            },
            onHover: {
                enable: true,
                mode: "repulse",
            },
            resize: true,
        },
        modes: {
            bubble: {
                distance: 100,
                duration: 2,
                opacity: 0.8,
                size: 40,
            },
            push: {
                quantity: 0,
            },
            repulse: {
                distance: 100,
                duration: 0.4,
            },
        },
    },
    particles: {
        color: {
            value: "#ffffff",
        },
        links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
        },
        collisions: {
            enable: false,
        },
        move: {
            direction: "none",
            enable: true,
            outMode: "bounce",
            random: true,
            speed: 2,
            straight: false,
        },
        number: {
            density: {
                enable: true,
                value_area: 800,
            },
            value: 80,
        },
        opacity: {
            value: 0.5,
        },
        shape: {
            type: "circle",
        },
        size: {
            random: true,
            value: 5,
        },
    },
    detectRetina: true,
};

export default function Home(){
    const particlesInit = (main: any) => {
        console.log(main);
    };
    const particlesLoaded = (container: any) => {
        console.log(container);
    };
    return (
        <div id="vs-home">
          <span>
            <h1 className="display-1">VisualSource</h1>
          </span>
          <Particles id="tsparticles" init={particlesInit} loaded={particlesLoaded} options={config}/>
        </div>
    );
}