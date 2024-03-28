import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ITask } from '../models/models';
import TaskEditForm from '../components/TaskEditForm';
import GoButton from '../components/GoButton';

/*страница редактирования задачи*/
const TaskEditPage: React.FC = () => {
  const [task, setTask] = useState<ITask | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/task/${id}`); //запрос на редактирования задачи по id
        setTask(res.data);
      } catch (error) {
        console.error('Ошибка при загрузке задачи:', error);
      }
    };

    fetchTask();
  }, [id]);

  return (
    <div className="container">
      <h1 className="title">Редактирование задачи №{id}</h1>
      <GoButton text="&#8592; Назад" nav="/"/>
      {task ? <TaskEditForm task={task} /> : <p>Загрузка...</p>}
    </div>
  );
};

export default TaskEditPage;
