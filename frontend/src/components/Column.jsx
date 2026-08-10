import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

function Column({ title, tasks }) {
  return (
    <Droppable droppableId={title}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-gray-100 rounded-xl p-4 w-80 min-h-[500px]"
        >
          <h2 className="text-xl font-bold mb-4">
            {title}
          </h2>

          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
            />
          ))}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default Column;