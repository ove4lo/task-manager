import React, { useState } from 'react';
import axios from 'axios';
import { ITask } from '../models/models';
import { useNavigate } from "react-router-dom";

interface Props {
    task: ITask;
}

/*форма для редактирования задачи*/
const TaskEditForm: React.FC<Props> = ({ task }) => {

    const formattedDate = new Date(task.dateofcreation).toLocaleDateString('en-CA'); //изменяем формат даты

    const [name, setName] = useState(task.name);
    const [description, setDescription] = useState(task.description);
    const [dateofcreation, setDateofcreation] = useState(formattedDate);
    const [priority, setPriority] = useState(task.priority);
    const [marks, setMarks] = useState(task.marks);
    const marksList = ['research', 'design', 'development'];

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const date = new Date(dateofcreation); //изменяем формат даты

            //новые данные для задачи
            const newTask: ITask = {
                name,
                description,
                dateofcreation: date,
                priority,
                marks: marks.length > 0 ? marks: []
            };

            await axios.put(`http://localhost:3001/edit/${task.id}`, newTask); //запрос для изменения данных о задаче по id

            alert('Задание успешно обновлено'); //сообщение об успешном изменении

            navigate("/"); //переходим на главную страницу

        } catch (error) {
            alert('Произошла ошибка при изменении задания'); //сообщение об неудачном изменении
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

    //берем старые данные задачи по id и вставляем их в поля
    //пользователь может так все оставить или изменить
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
            <button type="submit" className="btn">Изменить задачу</button>
        </form>
    );
};

export default TaskEditForm;

