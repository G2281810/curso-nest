import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status-enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { updateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { Logger } from '@nestjs/common';



@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private taskService: TasksService){
        
    } 
    //Mostrar todas las tareas//
    @Get()
    getTasks(
        @Query() filterDto: GetTasksFilterDto,
        @GetUser() user:User
        ): Promise<Task[]>{
            this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
        return this.taskService.getTasks(filterDto, user);
    }
    //Mostrar tareas por id//
    @Get('/:id')
    getTaskById(@Param('id') id: string,
                @GetUser() user:User): Promise<Task>{
        return this.taskService.getTaskById(id,user);
    }

    //Crear una nueva tarea//
    @Post()
    createTask(
        @Body() CreateTaskDto:CreateTaskDto,
        @GetUser() user: User,
        ): Promise<Task>{
            this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(CreateTaskDto)} `)
        return this.taskService.createTask(CreateTaskDto, user);
    }
    //Eliminar tarea//
    @Delete('/:id')
    deleteTask(@Param('id') id: string, @GetUser() user: User,): Promise <void>{
        return this.taskService.deleteTask(id,user);
    }

    //Actualizar status//
    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id:string,
        @Body() updateTaskStatusDto: updateTaskStatusDto,  
        @GetUser() user: User,
    ): Promise<Task>{
        const {status} = updateTaskStatusDto;
        return this.taskService.updateTaskStatus(id,status,user);
    } 
}
