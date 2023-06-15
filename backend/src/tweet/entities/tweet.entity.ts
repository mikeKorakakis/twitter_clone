import { Field, ID, ObjectType } from "@nestjs/graphql";
import { AbstractEntity, User } from "../../common/entities";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";


@Entity()
@ObjectType()
export class Tweet extends AbstractEntity<Tweet>{
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    content: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.tweets)
    author: User;

    @Field()
    @Column()
    public authorId: string;
    
}