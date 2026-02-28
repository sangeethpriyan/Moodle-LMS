import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('access_restrictions')
export class AccessRestriction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  userId!: number;

  @OneToOne(() => User, user => user.accessRestriction)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ default: false })
  isRestricted!: boolean;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ nullable: true })
  restrictedAt?: Date;

  @Column({ nullable: true })
  restrictedBy?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
