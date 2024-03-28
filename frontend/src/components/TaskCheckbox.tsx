import React, { useState } from 'react';

interface TaskCheckBoxProps {
  items: string[];
  onCheckBoxChange: (checkedItems: string[]) => void;
}

/*Массив чек-боксов*/
/*Передаем массив тем из чего делаем массив чек-боксов, а так же следим за изменениями */
const TaskCheckBox: React.FC<TaskCheckBoxProps> = ({ items, onCheckBoxChange }) => {
  const [marks, setMarks] = useState<string[]>([]);

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
    onCheckBoxChange(updatedMarks); //обновляем данные о нажатии на чек-бокс
  };

  return (
    <div className="task-checkbox">
      {items.map(item => (
        <label key={item}>
          <input
            type="checkbox"
            value={item}
            checked={marks.includes(item)}
            onChange={handleCheckboxChange}
          />
          {item}
        </label>
      ))}
    </div>
  );
};

export default TaskCheckBox;
