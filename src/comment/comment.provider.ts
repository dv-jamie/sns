import { Comment } from 'src/_entity/comment.entity';
import { DataSource } from 'typeorm';

export const commentProviders = [
  {
    provide: 'COMMENT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Comment),
    inject: ['DATA_SOURCE'],
  },
];