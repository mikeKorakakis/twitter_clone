import { ObjectType, Field, Int } from '@nestjs/graphql';
import { AbstractEntity, User } from '../../common/entities';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
@Entity()
export class Post extends AbstractEntity<Post> {
  @Field()
  @Column({
    name: 'title',
    type: 'text',
    nullable: true,
  })
  public title: string;

  @Field((type) => GraphQLJSON, { nullable: true })
  @Column({
    name: 'content',
    type: 'json',
    nullable: true,
  })
  public content: any;

  @Field()
  @Column({
    name: 'published',
    type: 'boolean',
    nullable: true,
  })
  public published: boolean;

  @Field()
  @Column({ name: 'author_id' })
  public authorId: string;

  @Field((type) => User)
  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'author_id' })
  public author: User;
}
