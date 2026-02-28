import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { UserRole } from '../types';
import { Payment } from './Payment';
import { AccessRestriction } from './AccessRestriction';
import { StudentLog } from './StudentLog';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role!: UserRole;

  @Column({ nullable: true })
  moodleUserId?: number;

  @Column({ nullable: true })
  moodleToken?: string;

  @Column({ default: true })
  isActive!: boolean;

  @OneToOne(() => AccessRestriction, restriction => restriction.user)
  accessRestriction?: AccessRestriction;

  @OneToMany(() => Payment, payment => payment.user)
  payments?: Payment[];

  @OneToMany(() => StudentLog, log => log.user)
  logs?: StudentLog[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Helper method to get full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Helper method to check if payment is required
  get requiresPayment(): boolean {
    return this.role === UserRole.STUDENT && this.accessRestriction?.isRestricted === true;
  }
}
