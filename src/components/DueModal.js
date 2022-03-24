import { Modal } from "./Modal"


export function DueModal({items, close}) {

    return (
        <Modal close={close}>
            <div className="due-modal">

            <h1>Due Today</h1>

            {items.map((item) => {
                return (
                    <div className="due-objective">
                        <p className="title" key={item.id}>  {item.name} </p>
                    </div>)
            })}

            </div>
        </Modal>
    )
}