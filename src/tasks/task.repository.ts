import { Task } from './task.entity';
import { EntityRepository, Repository } from'typeorm'
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    
    const query = this.createQueryBuilder();

    const tasks = query.getMany();

    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;

    await task.save();
    return task;
  }
}