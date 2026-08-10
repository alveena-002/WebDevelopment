import { DragDropContext } from "@hello-pangea/dnd";
import api from "../services/api";
import Column from "./Column";

function Board({ tasks }) {

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    try {
      await api.put(`/tasks/${taskId}`, {
        status: newStatus,
      });

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 p-6 overflow-auto">

        <Column
          title="Todo"
          tasks={tasks.filter((t) => t.status === "Todo")}
        />

        <Column
          title="In Progress"
          tasks={tasks.filter((t) => t.status === "In Progress")}
        />

        <Column
          title="Done"
          tasks={tasks.filter((t) => t.status === "Done")}
        />

      </div>
    </DragDropContext>
  );
}

export default Board;