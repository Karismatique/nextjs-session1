import Link from 'next/link';
import LikeButton from '@/components/LikeButton';

type PostCardProps = {
  id: number;
  author: string;
  handle: string;
  title: string;
  body: string;
  likes: number;
  time: string;
};

export default function PostCard({ id, author, handle, title, body, likes, time }: PostCardProps) {
  return (
    <article className="post-card">
      <div className="post-header">
        <div className="post-author-info">
          <span className="post-author">{author}</span>
          <span className="post-handle">{handle}</span>
        </div>
        <time className="post-time">{time}</time>
      </div>

      {/* CORRECTION ICI : On utilise une classe CSS classique */}
      <Link href={`/posts/${id}`} className="post-link">
        <h3 style={{ margin: '0.5rem 0', fontWeight: 'bold', color: '#111827' }}>
          {title}
        </h3>
      </Link>
      
      <p className="post-content">
        {body}
      </p>

      <div className="post-footer">
        <LikeButton initialLikes={likes} />
      </div>
    </article>
  );
}