import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { TaskStatus } from "./task-status-enum";
import { TasksRepository } from "./task.repository";
import { TasksModule } from "./tasks.module";
import { TasksService } from "./tasks.service"
const mockTasksRepository = () =>({
    getTasks: jest.fn(),
    findOne: jest.fn(),
});

const mockUser = {
    username: 'Carlos',
    id: 'someId',
    password: 'somePassword',
    tasks: [],
}
describe('TasksService', ()=>{
    let tasksService: TasksService;
    let tasksRepository;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {provide: TasksRepository, useFactory: mockTasksRepository},
            ],
        }).compile();

        tasksService = module.get(TasksService);
        tasksRepository = module.get(TasksRepository);
    });


    describe('getTasks',()=>{
        it('calls tasksRepository.getTasks and returns the result', async ()=>{
            tasksRepository.getTasks.mockResolvedValue('Some value');
            const result = await tasksService.getTasks(null, mockUser);
            expect(result).toEqual('Some value');
        });
    });
    describe('getTasksById', ()=>{
        it('calls TasksRepository.findOne and return the result', async ()=>{
            const mockTask = {
                title: 'Test title',
                description: 'Test desc',
                id: 'someId',
                status: TaskStatus.OPEN,
            };
            tasksRepository.findOne.mockResolvedValue(mockTask);
            const result = await tasksService.getTaskById('SomeId', mockUser);
            expect(result).toEqual(mockTask);
        });
    
        it('calls TasksRepository.findOne and errors', async ()=>{
            tasksRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById('someId',mockUser)).rejects.toThrow(
                NotFoundException,
            );
        });
    })
});

