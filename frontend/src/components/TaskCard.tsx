import { NavLink } from "react-router-dom";
import { ITask } from "../models/models";


/*карточка задачи*/
/*передаем данные и при нажатии на карточку товара переходим на ее просмотр*/
const TaskCard: React.FC<ITask> = ({ id, name, description, dateofcreation, priority, marks }) => {

    const formattedDate = new Date(dateofcreation).toLocaleDateString(); //изменяем формат даты для корректного отображения
    return (
        <NavLink to={`/task/${id}`} className='task nav-link'>
            <div> 
                <h3>{name}</h3>
                <p>Дата создания: {formattedDate}</p>
                <p>Приоритет: {priority}</p>
                <p className="marks"> 
                    {marks && marks.length > 0 ? (
                        <>Отметки: {marks.map((mark, index) => (
                            <span className="mark" key={index}>{mark}</span>
                        ))}</>
                    ) : (
                        "Отметок нет"
                    )}
                </p>

                <p className="description">Описание: {description}</p>
            </div>
        </NavLink>
    )
}

export default TaskCard;