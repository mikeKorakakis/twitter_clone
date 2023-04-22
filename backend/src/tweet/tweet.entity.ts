import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
  } from 'typeorm';
  import { User } from '../user/user.entity';
  import { ObjectType, Field, ID } from '@nestjs/graphql';

  
  @Entity()
  @ObjectType()
  export class Tweet {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Field()
    @Column()
    content: string;
  
    @Field(() => User)
    @ManyToOne(() => User, (user) => user.tweets)
    author: User;
  
    @Field(() => Date)
    @Column()
    createdAt: Date;
  }