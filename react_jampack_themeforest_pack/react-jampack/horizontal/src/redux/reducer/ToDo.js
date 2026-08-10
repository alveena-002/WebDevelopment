import { CHANGE_VM } from "../constants/ToDo";

const initialState = {
    vm: "Week"
}

const ToDoReducer = (state = initialState, action) => {
    switch (action.type) {

        case CHANGE_VM:
            return {
                ...state,
                vm: action.vm
            };
        default:
            return state;
    }
};

export default ToDoReducer;