export default function Message() {
    const isLogged = true;

    return (
        <>
            <h3>
                {isLogged ? "Youa are logged in!" : "Please log in"}
            </h3>
        </>
    )
}