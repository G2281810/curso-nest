import { Exclude } from "class-transformer";
import { User } from "../auth/user.entity";
import { Entity, PrimaryGeneratedColumn,Column, ManyToOne } from "typeorm";
import { TaskStatus } from "./task-status-enum";
import { MinLength } from "class-validator";

@Entity()
export class Task{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @MinLength(1)
    @Column()
    title:string;

    @Column()
    description:string;

    @Column()
    status: TaskStatus;

    @ManyToOne((_type) => User, (user) => user.tasks, {eager:false})
    @Exclude({ toPlainOnly:true })
    user:User;
}