import React, { useState } from 'react';
import TaskSort from './TaskSort';
import TaskCheckBox from './TaskCheckbox';

const priorityList = ['low', 'normal', 'high'];
const marksList = ['research', 'design', 'development'];

interface TaskFilterProps {
  onSortChange: (sortType: string) => void;
  onCheckBoxPrioritiesChange: (checkedPriorities: string[]) => void;
  onCheckBoxMarksChange: (checkedMarks: string[]) => void;
}

/*блок фильтрации и сортировки карточек задач*/
const TaskFilter: React.FC<TaskFilterProps> = ({ onSortChange, onCheckBoxMarksChange, onCheckBoxPrioritiesChange }) => {

  return (
    <div className="task-filter">
      <h3>Сортировка</h3>
      <TaskSort onSortChange={onSortChange} />
      <h3>Приоритет</h3>
      <TaskCheckBox items={priorityList} onCheckBoxChange={onCheckBoxPrioritiesChange} />
      <h3>Отметки</h3>
      <TaskCheckBox items={marksList} onCheckBoxChange={onCheckBoxMarksChange} />
    </div>
  );
};

export default TaskFilter;
