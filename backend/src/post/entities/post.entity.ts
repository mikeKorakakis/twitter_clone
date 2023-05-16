import { ObjectType, Field, Int } from '@nestjs/graphql';
import { AbstractEntity } from '../../common/entities';
import { Column, Entity } from 'typeorm';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
@Entity()
export class Post extends AbstractEntity<Post>{
    @Field()
    @Column({
        name: 'title',
        type: 'text',
        nullable: true
    })
    public title: string;

    @Field((type) => GraphQLJSON , { nullable: true })
    @Column({
        name: 'content',
        type: 'json',
        nullable: true
    })
    public content: any;

    @Field()
    @Column({
        name: 'published',
        type: 'boolean',
        nullable: true
    })
    public published: boolean;
}
