import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ITask } from "../models/models";
import GoButton from '../components/GoButton';
import DeleteButton from '../components/DeleteButton';

/*страница просмотра задачи*/
const TaskDetailsPage: React.FC = () => {
  const [task, setTask] = useState<ITask | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get<ITask>(`http://localhost:3001/task/${id}`); //получение деталей задачи по id
        setTask(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке задачи:', error);
      }
    };

    fetchTask();

  }, [id]); 

  return (
    <div className="container">
      <h1 className="title">{task ? task.name : ''}</h1>
      {task ? (
        <div className="task details">
          <GoButton text="&#8592; Назад" nav="/" />
          <div>
            <p>Дата создания: {new Date(task.dateofcreation).toLocaleDateString()}</p>
            <p>Приоритет: {task.priority}</p>
            <p className="marks">
              {task.marks.length > 0 ? (
                <>Отметки: {task.marks.map((mark, index) => (
                  <span className="mark" key={index}>{mark}</span>
                ))}</>
              ) : (
                "Отметок нет"
              )}
            </p>
            <p>Описание: {task.description}</p>
          </div>
          <div className="buttons-container">
            <DeleteButton task_id={`${task.id}`} />
            <GoButton text="Редактировать" nav={`/edit/${task.id}`} />
          </div>
        </div>
      ) : (
        <p>Загрузка...</p>
      )}
    </div>
  );
}

export default TaskDetailsPage;
