import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({ //подключение к бд
  host: "localhost",
  user: "root",
  password: "2Banan@",
  database: "manageroftasks",
});

app.get("/tasks", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  limit = parseInt(limit, 10);

  const qTotalCount = `SELECT COUNT(*) AS totalCount FROM manageroftasks.task`;

  db.query(qTotalCount, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }

    const totalCount = result[0].totalCount;

    const qTasks = `
      SELECT task.*, 
      GROUP_CONCAT(mark.type) AS marks 
      FROM manageroftasks.task 
      LEFT JOIN manageroftasks.mark 
      ON task.id = mark.task_id 
      GROUP BY task.id 
      ORDER BY task.dateofcreation 
      DESC
      LIMIT ? OFFSET ?`;

    db.query(qTasks, [limit, offset], (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }

      data.forEach(task => {
        if (task.marks) {
          task.marks = task.marks.split(',');
        } else {
          task.marks = [];
        }
      });

      return res.json({ tasks: data, totalCount: totalCount });
    });
  });
});



app.get("/sort", (req, res) => { //запрос на сортировку задач, по дефолту стоит от новых к старым
  const sortType = req.query.sort;

  let q = '';
  q = `
      SELECT task.*, GROUP_CONCAT(mark.type) AS marks 
      FROM manageroftasks.task 
      LEFT JOIN manageroftasks.mark ON task.id = mark.task_id 
      GROUP BY task.id 
      ORDER BY task.dateofcreation`;

  if (sortType === 'Новые') {
    q += ' DESC';
  }

  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }

    data.forEach(task => {
      if (task.marks) {
        task.marks = task.marks.split(',');
      } else {
        task.marks = [];
      }
    });

    return res.json(data);
  });
});


app.get("/task/:id", (req, res) => { //получение данных задачи по id
  const taskId = req.params.id;

  const q = `SELECT task.*,
  GROUP_CONCAT(mark.type) AS marks 
  FROM manageroftasks.task 
  LEFT JOIN manageroftasks.mark 
  ON task.id = mark.task_id 
  WHERE task.id = ? 
  GROUP BY task.id;`;

  db.query(q, [taskId], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }

    data.forEach(task => {
      if (task.marks) {
        task.marks = task.marks.split(',');
      } else {
        task.marks = [];
      }
    });

    return res.json(data[0]);
  });
});

app.delete("/task/delete/:id", (req, res) => { //удаление задачи по id
  const taskId = req.params.id;

  const q = `DELETE FROM manageroftasks.mark 
  WHERE task_id = ?`;

  db.query(q, [taskId], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }

    const qmark = `DELETE FROM manageroftasks.task WHERE id = ?`;

    db.query(qmark, [taskId], (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }

      return res.status(200).json({ message: "Successful" });
    });
  });
});

app.put("/add", (req, res) => { //добавление новой задачи
  const { name, description, dateofcreation, priority, marks } = req.body;

  const formattedDate = new Date(dateofcreation).toISOString().split('T')[0];

  const q = `INSERT INTO manageroftasks.task 
  (name, description, dateofcreation, priority) 
  VALUES (?, ?, DATE(?), ?)`;

  db.query(q, [name, description, formattedDate, priority], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }

    const taskId = data.insertId;

    if (Array.isArray(marks) && marks.length > 0) {

      const qmark = `INSERT INTO manageroftasks.mark (task_id, type) VALUES ?`;

      const markValues = marks.map(mark => [taskId, mark]);

      db.query(qmark, [markValues], (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: err.message });
        }

        return res.status(201).json({ message: "Task and marks added successfully" });
      });
    } else {
      return res.status(201).json({ message: "Task added successfully" });
    }
  });
});

app.put("/edit/:id", (req, res) => { //изменение задачи по id
  const taskId = req.params.id; // Получаем id из параметра маршрута

  const { name, description, dateofcreation, priority, marks } = req.body;

  const formattedDate = new Date(dateofcreation).toISOString().split('T')[0];

  const q = `UPDATE manageroftasks.task 
  SET name = ?, 
  description = ?, 
  dateofcreation = DATE(?), 
  priority = ? 
  WHERE id = ?`;

  db.query(q, [name, description, formattedDate, priority, taskId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (Array.isArray(marks) && marks.length > 0) {
      const qmarkdelete = `DELETE FROM manageroftasks.mark WHERE task_id = ?`;
      db.query(qmarkdelete, [taskId], (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: err.message });
        }

        const qmarkadd = `INSERT INTO manageroftasks.mark (task_id, type) VALUES ?`;
        const markValues = marks.map(mark => [taskId, mark]);
        db.query(qmarkadd, [markValues], (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
          }

          return res.status(200).json({ message: "Task and marks edited successfully" });
        });
      });
    } else {
      const qmarkdelete = `DELETE FROM manageroftasks.mark WHERE task_id = ?`;
      db.query(qmarkdelete, [taskId], (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: err.message });
        }
        return res.status(200).json({ message: "All marks for the task deleted successfully" });
      });
    }
  });
});

app.get("/tasks/by/priority", async (req, res) => { //фильтрация по приоритетам
  const priorities = req.query.priorities; 

  try {
    let tasksData;
    let allMarksData;

    if (!priorities) {
      const q = `
      SELECT task.*, 
      GROUP_CONCAT(mark.type) AS marks 
      FROM manageroftasks.task 
      LEFT JOIN manageroftasks.mark 
      ON task.id = mark.task_id 
      GROUP BY task.id 
      ORDER BY task.dateofcreation 
      DESC`;
      tasksData = await new Promise((resolve, reject) => {
        db.query(q, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    } else {
      const priorityArray = priorities.split(',');
      const placeholders = priorityArray.map(() => '?').join(',');

      const tasksQuery = `
        SELECT task.*
        FROM task
        WHERE task.priority IN (${placeholders})`;

      tasksData = await new Promise((resolve, reject) => {
        db.query(tasksQuery, priorityArray, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }

    const tasksId = tasksData.map(task => task.id);
    const allMarksQuery = `
      SELECT mark.task_id, GROUP_CONCAT(mark.type) AS marks
      FROM mark
      WHERE mark.task_id IN (${tasksId.join(',')})
      GROUP BY mark.task_id`;

    allMarksData = await new Promise((resolve, reject) => {
      db.query(allMarksQuery, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    const marksMap = {};
    allMarksData.forEach(mark => {
      marksMap[mark.task_id] = mark.marks.split(',');
    });

    const tasks = tasksData.map(task => {
      return {
        ...task,
        marks: marksMap[task.id] || []
      };
    });

    return res.json(tasks);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});


app.get("/tasks/by/mark", async (req, res) => { //фильтрация по отметкам
  const marks = req.query.marks;

  try {
    let q, tasksData;

    if (!marks) {
      const q = `SELECT task.*, 
      GROUP_CONCAT(mark.type) AS marks 
      FROM manageroftasks.task 
      LEFT JOIN manageroftasks.mark 
      ON task.id = mark.task_id 
      GROUP BY task.id 
      ORDER BY task.dateofcreation 
      DESC`;
      tasksData = await new Promise((resolve, reject) => {
        db.query(q, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    } else {
      const marksArray = marks.split(',');
      const placeholders = marksArray.map(() => '?').join(',');

      q = `
        SELECT task.*
        FROM task
        INNER JOIN mark ON task.id = mark.task_id
        WHERE mark.type IN (${placeholders})
        GROUP BY task.id`;

      tasksData = await new Promise((resolve, reject) => {
        db.query(q, marksArray, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }

    const tasksId = tasksData.map(task => task.id);
    const qmark = `
      SELECT mark.task_id, GROUP_CONCAT(mark.type) AS marks
      FROM mark
      WHERE mark.task_id IN (${tasksId.join(',')})
      GROUP BY mark.task_id`;

    const allMarksData = await new Promise((resolve, reject) => {
      db.query(qmark, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    const marksMap = {};
    allMarksData.forEach(mark => {
      marksMap[mark.task_id] = mark.marks.split(',');
    });

    const tasks = tasksData.map(task => {
      return {
        ...task,
        marks: marksMap[task.id] || []
      };
    });

    return res.json(tasks);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});


app.listen(3001, () => {
  console.log("Connected to backend.");
});
