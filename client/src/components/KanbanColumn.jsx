import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

export default function KanbanColumn({ column, tasks, onAddTask, onEditTask, projectId }) {
  return (
    <div className="kanban-col">
      <div className="kanban-col-header">
        <div className="kanban-col-title">
          <span className="col-dot" style={{ background: column.color }} />
          {column.label}
          <span className="kanban-col-count">{tasks.length}</span>
        </div>
        <button className="btn-ghost btn-icon" onClick={onAddTask} style={{ padding: 4 }}>
          <Plus size={14} />
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`kanban-cards ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} onEdit={onEditTask} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
