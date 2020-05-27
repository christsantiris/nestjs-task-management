import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from '../tasks/dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
    ) {}

  async getTasks(filterDto: GetTasksFilterDto,
    user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number): Promise<Task> {
    const taskFound = await this.taskRepository.findOne(id);

    if (!taskFound) {
      throw new NotFoundException(`Task not found with Id: ${id}`);
    }

    return taskFound;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User) {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task not found with Id: ${id}`);
    }
  }
}
