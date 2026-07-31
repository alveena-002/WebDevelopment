import { Draggable } from "@hello-pangea/dnd";

function TaskCard({ task, index }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-lg shadow p-3 mb-3"
        >
          <h3 className="font-semibold">
            {task.title}
          </h3>

          <p className="text-gray-500 text-sm">
            {task.description}
          </p>
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;