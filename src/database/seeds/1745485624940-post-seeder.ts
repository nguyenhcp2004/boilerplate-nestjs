import { PostEntity } from '@/api/post/entities/post.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class PostSeeder1745485624940 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    // Creating post by using repository
    console.log('seeding data 1');
    const repository = dataSource.getRepository(PostEntity);
    await repository.insert(
      new PostEntity({
        title: 'Post 1',
        content: 'Content 1',
      }),
    );
    console.log('seeding data');
    // Creating post by using factory
    const postFactory = factoryManager.get(PostEntity);
    await postFactory.saveMany(5);
    console.log('Seed data success');
  }
}
