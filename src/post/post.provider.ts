import { PostEntity } from 'src/_entity/post.entity';
import { DataSource } from 'typeorm';

export const postProviders = [
  {
    provide: 'POST_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PostEntity),
    inject: ['DATA_SOURCE'],
  },
];