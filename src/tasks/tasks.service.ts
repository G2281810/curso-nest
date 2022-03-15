import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status-enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';
@Injectable()
//Recuerda pedaso de idiota que debes de utilizar los services para obtener los datos//
export class TasksService {
    constructor(
        @InjectRepository(TasksRepository)
        private taskRepository: TasksRepository
    ){}

    getTasks(filterDto:GetTasksFilterDto, user:User): Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto,user);
    }

    //Crear una nueva tarea//
    async createTask(createTaskDto:CreateTaskDto, user:User): Promise<Task>{
        return this.taskRepository.createTask(createTaskDto, user);
    }
    //Buscando tarea por un id//
    async getTaskById(id:string, user:User): Promise<Task>{
        const found = await this.taskRepository.findOne({where: {id,user}});

        if (!found){
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return found;
    }
    //Eliminar una tarea//
    async deleteTask(id: string, user:User): Promise<void>{
        const result = await this.taskRepository.delete({id,user});
        if(result.affected === 0){
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        
    }
    //Actualizar tarea//
    async updateTaskStatus(id: string, status:TaskStatus, user:User): Promise<Task>{
        const task = await this.getTaskById(id,user);
        task.status = status;
        await this.taskRepository.save(task);
        return task;
    } 
}
