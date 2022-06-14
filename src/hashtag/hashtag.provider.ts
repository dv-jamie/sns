import { Hashtag } from 'src/_entity/hashtag.entity';
import { DataSource } from 'typeorm';

export const hashtagProviders = [
  {
    provide: 'HASHTAG_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Hashtag),
    inject: ['DATA_SOURCE'],
  },
];