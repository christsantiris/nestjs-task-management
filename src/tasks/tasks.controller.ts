import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'; 
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskController');
  constructor(private tasksService: TasksService) {

  }

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto,
  @GetUser() user: User): Promise<Task[]> {
    this.logger.verbose(`Getting tasks for "${user.username}". Filters: ${JSON.stringify(filterDto)}`)
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number,
  @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() creatTaskDto: CreateTaskDto,
  @GetUser() user: User): Promise<Task> {
    this.logger.verbose(`User "${user.username}" is creating a task. Data: ${JSON.stringify(creatTaskDto)}`)
    return this.tasksService.createTask(creatTaskDto, user);
  }

  // using TaskStatusValidationPipe middleware
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number,
  @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }
}
