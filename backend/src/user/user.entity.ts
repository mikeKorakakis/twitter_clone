import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Tweet } from '../tweet/tweet.entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  role: string;

  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Tweet, (tweet) => tweet.author)
  tweets: Tweet[];
}
