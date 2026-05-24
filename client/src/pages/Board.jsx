import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useTasks } from '../context/TaskContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import KanbanColumn from '../components/KanbanColumn';
import TaskModal from '../components/TaskModal';
import { Plus, ArrowLeft } from 'lucide-react';

const COLUMNS = [
  { id: 'todo',       label: 'To Do',       color: '#8888aa' },
  { id: 'inprogress', label: 'In Progress',  color: '#6c63ff' },
  { id: 'review',     label: 'Review',       color: '#ffa502' },
  { id: 'done',       label: 'Done',         color: '#2ed573' },
];

export default function Board() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { tasks, projects, fetchTasks, fetchProjects, moveTask } = useTasks();
  const [showModal, setShowModal]     = useState(false);
  const [editTask, setEditTask]       = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  const project = projects.find((p) => p._id === projectId);

  useEffect(() => {
    fetchTasks(projectId);
    if (projects.length === 0) fetchProjects();
  }, [projectId]);

  const getColumnTasks = (colId) =>
    tasks.filter((t) => t.status === colId).sort((a, b) => a.order - b.order);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    await moveTask(draggableId, destination.droppableId, destination.index);
  };

  const openCreate = (status = 'todo') => {
    setEditTask(null);
    setDefaultStatus(status);
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="board" activeProjectId={projectId} />
      <div className="main-content">
        <Header
          title={project?.name || 'Board'}
          subtitle={project?.description}
          left={
            <button className="btn-ghost btn-icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={18} />
            </button>
          }
          right={
            <button className="btn btn-primary btn-sm" onClick={() => openCreate()}>
              <Plus size={15} /> Add Task
            </button>
          }
        />
        <div className="page-body fade-in" style={{ paddingBottom: 40 }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="board-container">
              {COLUMNS.map((col) => (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  tasks={getColumnTasks(col.id)}
                  onAddTask={() => openCreate(col.id)}
                  onEditTask={openEdit}
                  projectId={projectId}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      {showModal && (
        <TaskModal
          projectId={projectId}
          editTask={editTask}
          defaultStatus={defaultStatus}
          onClose={() => { setShowModal(false); setEditTask(null); }}
        />
      )}
    </div>
  );
}
