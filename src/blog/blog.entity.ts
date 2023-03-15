import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blog')
export class Blog {
  @PrimaryGeneratedColumn({ name: 'blog_id' })
  blogId: number;

  @Column({ name: 'blog_title' })
  blogTitle: string;

  @Column({ name: 'blog_summary' })
  blogSummary: string;

  @Column({ name: 'blog_content', type: 'text' })
  blogContent: string;

  @Column({ name: 'blog_cover' })
  blogCover: string;

  @Column({ name: 'blog_tag' })
  blogTag: string;

  @Column({ name: 'blog_release_date', type: 'date' })
  blogReleaseDate: Date;

  @Column({ name: 'blog_comment_count', default: 0 })
  blogCommentCount: number;

  @Column({ name: 'blog_view_count', default: 0 })
  blogViewCount: number;

  @Column({ name: 'blog_featured', default: false })
  blogFeatured: boolean;
}
