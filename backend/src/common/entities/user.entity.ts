import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import * as argon2 from 'argon2';

import { AbstractEntity } from './';
import { Providers, AccountStatus, Role } from '../enums';
import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from '../../post/entities/post.entity';
// import { Invitation, Room } from '../../modules/v1/room/entities'
// import { Message } from '../../modules/v1/message/message.entity'
@ObjectType()
@Entity()
export class User extends AbstractEntity<User> {
  @Field()
  @Column({
    name: 'provider',
    nullable: true,
    type: 'enum',
    enum: Providers,
  })
  public provider: Providers;

  @Field()
  @Index()
  @Column({
    length: 200,
    name: 'provider_id',
    nullable: true,
  })
  public providerId: string;

  @Field()
  @Index()
  @Column({
    unique: true,
    length: 200,
    name: 'email',
    nullable: false,
  })
  public email: string;

  @Field()
  @Column({
    length: 200,
    name: 'password',
    nullable: false,
  })
  public password: string;

  @Field()
  @Column({
    length: 200,
    name: 'first_name',
    nullable: false,
  })
  public firstName: string;

  @Field()
  @Column({
    length: 200,
    name: 'last_name',
    nullable: false,
  })
  public lastName: string;

  @Field()
  @Column({
    unique: true,
    length: 200,
    name: 'nick_name',
    nullable: false,
  })
  public displayName: string;

  @Field()
  @Column({
    length: 400,
    name: 'image',
    nullable: true,
    default: null,
  })
  public image: string;

  @Field()
  @Column({
    name: 'role',
    nullable: false,
    default: Role.USER,
    type: 'enum',
    enum: Role,
  })
  public role: Role;

  @Field()
  @Column({
    name: 'account_status',
    nullable: false,
    default: AccountStatus.PENDING,
    type: 'enum',
    enum: AccountStatus,
  })

  @Field((type) => [Post])
  @OneToMany(() => Post, (post) => post.author, { lazy: true })
  public posts: Post[];

  public accountStatus: AccountStatus;

  // @ManyToMany(() => Room, room => room.users)
  // public rooms: Room[]

  // @OneToMany(() => Message, message => message.author)
  // public messages: Message[]

  // @OneToMany(() => Invitation, invitation => invitation.user)
  // public invitations: Invitation[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}
