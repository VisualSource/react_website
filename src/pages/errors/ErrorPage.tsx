interface IErrorPageProps {
    error: number;
}

const errorMessage: { [key: number]: string } = {
    401: "Unauthorized",
    404: "Not Found"
}

export default function ErrorPage({ error }: IErrorPageProps){
    return (
        <div id="vs-error">
            <h1>{error} {errorMessage[error]}</h1>
        </div>
    );
}