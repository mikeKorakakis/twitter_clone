import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { instanceToPlain } from 'class-transformer'
import { ObjectType, Field } from '@nestjs/graphql'
  
@ObjectType()
export abstract class AbstractEntity<T> {

    constructor(partial: Partial<T>) {
        Object.assign(this, partial)
    }
    @Field()
    @PrimaryGeneratedColumn('uuid')
    public id: string
  
    @Field()
    @CreateDateColumn({
        type: 'timestamp without time zone',
        name: 'created_at'
    })
    public createdAt: Date
  
    @Field()
    @UpdateDateColumn({
        type: 'timestamp without time zone',
        name: 'updated_at',
    })
    public updatedAt: Date

    // toJSON() {
    //     return instanceToPlain(this)
    // }
}