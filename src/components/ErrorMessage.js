
export function ErrorMessage(props) {
    return(
        props.errors.map((error, key) => {
            return (<p className="error-message" key={key}> {error} </p>);
        })
    )
}