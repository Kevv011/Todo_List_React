import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { getTasks, addTask, updateTask, deleteTask } from '../services/TasksService';

// Componente que muestra el Form para crear una tarea
const TaskForm = ({ titleForm, handleAddEditTask, discardChanges, register}) => (
    <div className="mb-4 text-center">
        <h1 className="display-4">{titleForm}</h1>
        <form onSubmit={handleAddEditTask}>
            <div className="form-floating mb-3">
                <input
                    name="titleTask"
                    type="text"
                    className="form-control"
                    id="titulo-tarea"
                    placeholder="Tarea de ejemplo"
                    {...register('titleTask')}
                />
                <label htmlFor="titulo-tarea">Título de tarea</label>
            </div>
            <div className="form-floating mb-3">
                <textarea
                    name="descriptionTask"
                    id="descripcion-tarea"
                    className="form-control"
                    placeholder="Agregar una descripción"
                    style={{ height: '10vh' }}
                    {...register('descriptionTask')}
                ></textarea>
                <label htmlFor="descripcion-tarea">Descripción</label>
            </div>
            <div className="d-flex justify-content-between">
                <button className="btn btn-outline-danger" onClick={discardChanges} type="button">
                    <i className="bi bi-backspace"></i> Descartar
                </button>
                <button className="btn btn-outline-success" type="submit">
                    {titleForm === 'Editar tarea' ? <><i className="bi bi-pencil"></i> Editar</> : <><i className="bi bi-file-earmark-plus"></i> Agregar</>}
                </button>
            </div>
        </form>
    </div>
);

// Componente para mostrar las tareas en una tabla
const TaskTable = ({ tasks, handleToggleComplete, handleEditTask, handleDeleteTask }) => (
    <div className="table-responsive">
        <table className="table table-striped table-bordered task-table text-center">
            <thead className="table-dark">
                <tr>
                    <th className="completed-header">Hecho</th>
                    <th className="title-header">Título</th>
                    <th className="description-header">Descripción</th>
                    <th className="actions-header">Acciones</th>
                </tr>
            </thead>
            <tbody class="text-center">
                {tasks.map((task, index) => (
                    <tr key={task.id} className={task.completed ? "table-success" : ""}>
                        <td className="check-input-container">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggleComplete(index, task)}
                            />
                        </td>
                        <td>{task.titleTask}</td>
                        <td className="description-cell">{task.descriptionTask}</td>
                        <td className="actions-cell">
                            <button className="btn btn-warning me-2" onClick={() => handleEditTask(task)}>
                                <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDeleteTask(index, task)}>
                                <i className="bi bi-trash3"></i>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

function TodoList() {
    const [titleForm, setTileForm] = useState("Todo List: Creación de tareas");
    const [tasks, setTasks] = useState([]);
    const { register, handleSubmit, reset, setValue } = useForm();

    const fetchTasks = async () => {
        const tasks = await getTasks();
        setTasks(tasks);
    };

    const handleAddEditTask = async (data) => {
        if (data.titleTask.trim()) {
            if (data.id !== undefined) {
                await updateTask(data);
                let task = tasks.find(t => t.id == data.id);
                task.titleTask = data.titleTask;
                task.descriptionTask = data.descriptionTask;
                showAlert('success', '¡Tarea actualizada correctamente!');
                setTileForm("Crear tarea");
                reset();
            } else {
                data.completed = false;
                let response = await addTask(data);
                data.id = response.id;
                tasks.push(data);
                showAlert('success', '¡Tarea registrada correctamente!');
                reset();
            }
        } else {
            showAlert('warning', 'El título de la tarea es obligatorio.');
        }
    };

    const handleToggleComplete = async (index, task) => {
        task.completed = !task.completed;
        await updateTask(task);
        showAlert('success', `¡Tarea marcada como ${task.completed ? 'completada' : 'incompleta'} correctamente!`);
        setTileForm("Crear tarea");
        reset();
        const updatedTasks = tasks.map((task, i) => i === index ? { ...task, completed: task.completed } : task);
        setTasks(updatedTasks);
    };

    const handleDeleteTask = async (index, task) => {
        await deleteTask(task.id);
        showAlert('success', '¡Tarea eliminada correctamente!');
        setTasks(tasks.filter((_, i) => i !== index));
    };

    const handleEditTask = (task) => {
        setTileForm("Editar tarea");
        setValue('id', task.id);
        setValue('titleTask', task.titleTask);
        setValue('descriptionTask', task.descriptionTask);
    };

    const discardChanges = () => {
        reset();
    };

    const showAlert = (type, message) => {
        Swal.fire({
            title: type === 'success' ? '¡Bien hecho!' : '¡Advertencia!',
            text: message,
            icon: type,
            confirmButtonText: 'Aceptar'
        });
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <section className="container mt-4 todo-list">
            {/* Formulario de la tarea */}
            <TaskForm 
                titleForm={titleForm}
                handleAddEditTask={handleSubmit(handleAddEditTask)}
                discardChanges={discardChanges}
                register={register}
                setValue={setValue}
                reset={reset}
            />
            
            {/* Tabla de las tareas creadas */}
            {tasks.length > 0 ? (
                <TaskTable 
                    tasks={tasks}
                    handleToggleComplete={handleToggleComplete}
                    handleEditTask={handleEditTask}
                    handleDeleteTask={handleDeleteTask}
                />
            ) : (
                <div className="alert alert-info text-center">No hay tareas disponibles. Por favor, agrega una nueva tarea.</div>
            )}
        </section>
    );
}

export default TodoList;
