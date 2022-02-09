export const config: any = {
    autoPlay: true,
    background: {
        color: {
            value: "#0d1117",
        },
        position: "50% 50%",
        repeat: "no-repeat",
        size: "cover",
        opacity: 1
    },
    fullScreen: {
        enable: false,
        zIndex: 1
    },
    detectRetina: true,
    duration: 0,
    fpsLimit: 60,
    interactivity: {
        detectsOn: "window",
        events: {
            onClick: {
                enable: false,
                mode: "push",
            },
            onDiv: {
                selectors: [],
                enable: false,
                mode: [],
                type: "circle"
            },
            onHover: {
                enable: true,
                mode: "bubble",
                parallax: {
                    enable: false,
                    force: 2,
                    smooth: 10
                }
            },
            resize: true,
        },
        modes: {
            bubble: {
                distance: 400,
                duration: 2,
                mix: false,
                opacity: 0.8,
                size: 40,
                color: {
                    value: "#ff0000"
                }
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
    motion: {
        reduce: {
            factor: 4,
            value: true
        }
    },
    particles: {
        bounce: {
            horizontal: {
                random: {
                    enable: false,
                    minimumValue: 0.1
                },
                value: 1
            },
            vertical: {
                random: {
                    enable: false,
                    minimumValue: 0.1
                },
                value: 1
            }
        },
        color: {
            value: "#1b1e34",
            animation: {
                h: {
                    count: 0,
                    enable: false,
                    offset: 0,
                    speed: 1,
                    sync: true
                },
                s: {
                    count: 0,
                    enable: false,
                    offset: 0,
                    speed: 1,
                    sync: true
                },
                l: {
                    count: 0,
                    enable: false,
                    offset: 0,
                    speed: 1,
                    sync: true
                }
            }
        },
        destory: {
            mode: "none",
        },
        links: {
            color: "#ffffff",
            distance: 150,
            enable: false,
            opacity: 0.5,
            width: 1,
        },
        collisions: {
            enable: false,
            mode: "bounce",
            bounce: {
                horizontal: {
                    value: 1,
                    random: {
                        enable: false,
                        minimumValue: 0.1
                    }
                },
                vertical: {
                    value: 1,
                    random: {
                        enable: false,
                        minimumValue: 0.1
                    }
                }
            },
            overlap: {
                enable: true,
                retries: 0
            }
        },
        move: {
            angle: {
                offset: 0,
                value: 90
            },
            attract: {
                distance: 200,
                enable: false,
                rotate: {
                    x: 600,
                    y: 1200
                }
            },
            decay: 0,
            direction: "none",
            drift: 0,
            enable: true,
            gravity: {
                acceleration: 9.81,
                enable: false,
                inverse: false,
                maxSpeed: 50
            },
            path: {
                clamp: true,
                delay: {
                    value: 0,
                    random: {
                        minimumValue: 0,
                        enable: false,
                    }
                },
                enable: false,
            },
            outModes: {
                default: "out",
                bottom: "out",
                left: "out",
                right: "out",
                top: "out"
            },
            random: false,
            size: false,
            straight: false,
        },
        number: {
            density: {
                enable: true,
                area: 800,
                factor: 1000
            },
            limit: 0,
            value: 6,
        },
        opacity: {
            random: {
                enable: true,
                minimumValue: 0.3
            },
            value: {
                min: 0.3,
                max: 0.5
            }
        },
        shape: {
            options: {
                polygon: {
                    sides: 6
                }
            },
            type: "polygon"
        },
        size: {
            random: {
                enable: true,
                minimumValue: 100
            },
            value: {
                min: 100,
                max: 160
            }
        },
        stroke: {
            width: 0
        },
    },
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
    zLayers: 100
};