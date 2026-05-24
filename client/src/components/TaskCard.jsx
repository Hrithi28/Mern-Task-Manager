import { Draggable } from '@hello-pangea/dnd';
import { format, isPast, isToday } from 'date-fns';
import { Calendar, Pencil, Trash2, Flag } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const PRIORITY_COLORS = {
  low:      '#2ed573',
  medium:   '#ffa502',
  high:     '#ff4757',
  critical: '#ff1744',
};

export default function TaskCard({ task, index, onEdit }) {
  const { deleteTask } = useTasks();
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const overdue = due && !isPast === false && isPast(due) && task.status !== 'done';
  const dueToday = due && isToday(due);

  const initials = task.assignee?.name
    ? task.assignee.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : null;

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="task-card"
          style={{
            ...provided.draggableProps.style,
            '--priority-color': PRIORITY_COLORS[task.priority] || 'var(--accent)',
            opacity: snapshot.isDragging ? 0.85 : 1,
            boxShadow: snapshot.isDragging ? '0 12px 40px rgba(0,0,0,0.5)' : undefined,
            transform: snapshot.isDragging
              ? `${provided.draggableProps.style?.transform} rotate(2deg)`
              : provided.draggableProps.style?.transform,
          }}
        >
          {/* Top row: title + actions */}
          <div className="task-card-top">
            <h3 className="task-card-title">{task.title}</h3>
            <div className="task-actions">
              <button className="btn-ghost btn-icon" style={{ padding: 4 }}
                onClick={(e) => { e.stopPropagation(); onEdit(task); }}>
                <Pencil size={13} />
              </button>
              <button className="btn-ghost btn-icon" style={{ padding: 4, color: 'var(--danger)' }}
                onClick={(e) => { e.stopPropagation(); deleteTask(task._id); }}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="task-card-desc">{task.description}</p>
          )}

          {/* Badges */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            <span className={`badge badge-${task.priority}`}>
              <Flag size={9} /> {task.priority}
            </span>
            {task.label && (
              <span className={`badge badge-${task.label}`}>{task.label}</span>
            )}
          </div>

          {/* Footer */}
          <div className="task-card-footer">
            {due ? (
              <div className={`task-due ${overdue ? 'overdue' : ''}`}>
                <Calendar size={11} />
                {dueToday ? 'Today' : format(due, 'MMM d')}
              </div>
            ) : <span />}

            {initials && (
              <div className="avatar avatar-sm" title={task.assignee?.name}
                style={{ width: 24, height: 24, fontSize: 10 }}>
                {initials}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
