import { PostEntity } from '@/api/post/entities/post.entity';
import { Uuid } from '@/common/types/common.type';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Application view of the shared better-auth user table. Better-auth owns
 * credential data (account table) and writes user rows via its own adapter;
 * this entity maps the same table for application queries and relations.
 * No audit columns (created_by/updated_by) — see migration 1787991702330.
 */
@Entity('user')
export class UserEntity {
  constructor(data?: Partial<UserEntity>) {
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_user_id' })
  id!: Uuid;

  @Column({ length: 50, nullable: true })
  @Index('UQ_user_username', {
    where: '"deleted_at" IS NULL',
    unique: true,
  })
  username: string;

  @Column()
  @Index('UQ_user_email', { where: '"deleted_at" IS NULL', unique: true })
  email!: string;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ default: '' })
  name?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: Relation<PostEntity[]>;
}
