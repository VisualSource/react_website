import React from 'react';
export default function Game(){
    return (
        <div className="games-content">
            <div className="showing-game"></div>
            <button className="btn-right">{">"}</button>
            <button className="btn-left">{"<"}</button>
        </div>
    );
}