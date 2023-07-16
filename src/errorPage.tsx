import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

const getErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    let errorMsg: string;

    if (isRouteErrorResponse(error)) {
        errorMsg = error.error?.message || error.statusText;
    } else if (error instanceof Error) {
        errorMsg = error.message;
    } else {
        errorMsg = 'Unknown error';
    }

    return (
        <div id='error-page'>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{errorMsg}</i>
            </p>
        </div>
    );
};

export default function ErrorPage() {
    return getErrorPage();
}