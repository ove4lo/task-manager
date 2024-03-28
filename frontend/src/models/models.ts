/*интерфейс задачи*/
export interface ITask {
    id?: number;
    name: string;
    description: string;
    dateofcreation: Date;
    priority: string;
    marks: string[]; 
}
