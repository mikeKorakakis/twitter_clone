import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import * as argon2 from 'argon2';

import { AbstractEntity } from './';
import { Providers, AccountStatus, Role } from '../enums';
import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from '../../post/entities/post.entity';
import { Tweet } from '../../tweet/entities/tweet.entity';
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
  public accountStatus: AccountStatus;

  @Field((type) => [Post])
  @OneToMany(() => Post, (post) => post.author, { nullable: true })
  public posts?: Post[];

  @Field((type) => [Tweet])
  @OneToMany(() => Tweet, (tweet) => tweet.author, { nullable: true })
  public tweets?: Tweet[];

  @Field()
  @Column({
    name: 'stripe_customer_id',
    nullable: true,
    default: null,
  })
  public stripeCustomerId: string;

  @Field()
  @Column({
    name: 'stripe_subscription_id',
    nullable: true,
    default: null,
  })
  public stripeSubscriptionId: string;

  @Field()
  @Column({
    name: 'stripe_price_id',
    nullable: true,
    default: null,
  })
  public stripePriceId: string;

  @Field()
  @Column({
    name: 'stripe_current_period_end',
    nullable: true,
    default: null,
  })
  public stripeCurrentPeriodEnd: Date;

  @Field((type) => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.following, { nullable: true })
  @JoinTable()
  followers: User[];

  @Field((type) => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.followers, { nullable: true })
  @JoinTable()
  following: User[];



  @Field(() => Boolean, { nullable: true })
  isFollowed?: boolean;

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
