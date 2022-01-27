
export function ErrorMessage(props) {
    return(
        props.errors.map((error, key) => {
            return (<p className="red" key={key}> {error} </p>);
        })
    )
}