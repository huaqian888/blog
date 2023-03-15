import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('twitter')
export class Twitter {
  @PrimaryGeneratedColumn({ name: 'twitter_id' })
  twitterId: number;

  @Column({ name: 'twitter_content' })
  twitterContent: string;

  @Column({ name: 'twitter_release_date', type: 'datetime' })
  twitterReleaseDateTime: Date;
}
