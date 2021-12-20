export default function Spinner(){
    return (
        <div className="lds-facebook">
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
} 

export function SpinnerWrapper(){
    return (
        <div className="vs-spinner-wrapper">
            <Spinner/>
        </div>
    )
}