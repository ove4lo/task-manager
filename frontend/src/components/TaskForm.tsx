import React, { useState } from 'react';
import axios from 'axios';
import { ITask } from '../models/models';
import { useNavigate } from "react-router-dom";

//форма добавления задачи
const TaskForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dateofcreation, setDateofcreation] = useState('');
  const [priority, setPriority] = useState('');
  const [marks, setMarks] = useState<string[]>([]);
  const marksList = ['research', 'design', 'development'];

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const date = new Date(dateofcreation); //изменяем тип даты

      //создание нового задания
      const newTask: ITask = {
        name,
        description,
        dateofcreation: date,
        priority,
        marks
      };

      await axios.put("http://localhost:3001/add", newTask); //добавление новой задачи

      alert('Задание успешно добавлено'); //сообщение об успешном добавлении

      navigate("/"); //переходим на главную страницу

    } catch (error) {
      alert('Произошла ошибка при добавлении задания'); //сообщение об неудачном добавлении
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mark = e.target.value;
    const isChecked = e.target.checked;

    let updatedMarks = [...marks];
    if (isChecked) {
      updatedMarks.push(mark);
    } else {
      updatedMarks = updatedMarks.filter(item => item !== mark);
    }

    setMarks(updatedMarks);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-input">
        <label>Название задачи:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-input">
        <label>Описание:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="form-input">
        <label>Дата создания:</label>
        <input type="date" value={dateofcreation} onChange={(e) => setDateofcreation(e.target.value)} required />
      </div>
      <div className="form-input">
        <label>Приоритет:</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
          <option value="">Выберите приоритет</option>
          <option value="low">low</option>
          <option value="normal">normal</option>
          <option value="high">high</option>
        </select>
      </div>
      <div className="form-input">
        <label>Отметки:</label>
        <p className="task-checkbox">
          {marksList.map((item, index) => (
            <label key={index}>
              <input type="checkbox" value={item} checked={marks.includes(item)} onChange={handleCheckboxChange} />
              {item}
            </label>
          ))}
        </p>

      </div>
      <button type="submit" className="btn">Добавить задание</button>
    </form>
  );
};

export default TaskForm;

