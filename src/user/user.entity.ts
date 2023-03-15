import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_info')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ name: 'user_passwd' })
  userPasswd: string;

  @Column({
    name: 'user_avatar',
    default: `http://localhost:3000/default.png`,
  })
  userAvatar: string;

  @Column({ name: 'user_type', default: 1 })
  userType: number;
}
