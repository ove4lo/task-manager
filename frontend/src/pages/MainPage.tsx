import React, { useEffect, useState, useCallback } from 'react';
import TaskCard from '../components/TaskCard';
import { ITask } from '../models/models';
import TaskFilter from '../components/TaskFilter';
import axios from "axios";
import GoButton from '../components/GoButton';

/*основная страница*/
const MainPage: React.FC = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [fetching, setFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  /*для пагинации*/
  const scrollHandler = () => {
    if (document.documentElement.scrollHeight - (document.documentElement.scrollTop + window.innerHeight) < 100) {
      setFetching(true);
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);
    return () => {
      document.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  useEffect(() => {
    if (fetching) {
      axios.get(`http://localhost:3001/tasks?page=${currentPage}`) //запрос на сервер для получения всех задач
        .then((res) => {
          setTasks([...tasks, ...res.data]);
          setCurrentPage(prevState => prevState + 1);
        })
        .finally(() => setFetching(false));
    }
  }, [fetching, currentPage]);


  const handleSortChange = async (sortType: string) => {
    try {
      const res = await axios.get(`http://localhost:3001/sort?sort=${sortType}`); //запрос на сервер для сортировки задач
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleMarkChange = async (marks: string[]) => {
    try {
      const res = await axios.get(`http://localhost:3001/tasks/by/mark`, { //запрос на сервер для фильтрации задач по отметкам
        params: {
          marks: marks.join(',')
        }
      });
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePriorityChange = async (priorities: string[]) => {
    try {
      const res = await axios.get(`http://localhost:3001/tasks/by/priority`, {  //запрос на сервер для фильтрации задач по приоритету
        params: {
          priorities: priorities.join(',')
        }
      });
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Список задач</h1>
      <div className="main">
        <div className="task-filter">
          <GoButton text="Добавить задачу" nav="/add" />
          <TaskFilter onSortChange={handleSortChange} onCheckBoxPrioritiesChange={handlePriorityChange} onCheckBoxMarksChange={handleMarkChange} />
        </div>
        <div className="task-list">
          {tasks.map((task: ITask, index) => (
            <TaskCard key={index}
              id={task.id}
              name={task.name}
              description={task.description}
              dateofcreation={task.dateofcreation}
              priority={task.priority}
              marks={task.marks} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
