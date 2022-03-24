import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { restoreObjective } from "./slices/currentBoardSlice";
import { removeItem } from "./slices/localStorageSlice";


export function DeletedItems() {
    const { pathname } = useLocation();
    const boardId = pathname.split("/")[1];
    const deletedItems = useSelector((state) => state.local.value.find((board) => board.boardId === boardId));

    return (
        <div className="deleted-items">
            {deletedItems?.items.map((item) => {
                return <DeletedObjective boardId={boardId} key={item.id} data={item}/>
            })}
        </div>
    )
}

export function DeletedObjective({boardId, data}) {

    const { catId, ...objective } = data;
    const dispatch = useDispatch();

    return (
        <div className="flex deleted-objective soft-shadow">
            <p> {data.name} </p>
            <div className="options">
            <button onClick={() => dispatch(removeItem({boardId: boardId, objId: objective.id})) }> Remove </button>
            <button onClick={() => {dispatch(restoreObjective({catId: catId, objective: objective})); dispatch((removeItem({boardId: boardId, objId: objective.id})))} }> Restore </button>
            </div>
        </div>
    )
}