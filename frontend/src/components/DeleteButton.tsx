import { useNavigate } from "react-router-dom";
import axios from 'axios'

interface DeleteButtonProps {
    task_id: string;
}

/*кнопка удаления задачи*/
const DeleteButton: React.FC<DeleteButtonProps> = ({ task_id }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/task/delete/${task_id}`); //запрос на удаление задачи по его id
      alert("Задание успешно удалено"); //сообщение об удалении
      navigate("/"); //переходим на главную страницу
    } catch (error) {
      alert("Ошибка при удалении задания"); //сообщение об ошибке удалении
    }
  };

  return (
    <button onClick={handleDelete} className="btn btn-delete">
      <span>Удалить</span> 
    </button>
  );
};

export default DeleteButton;
