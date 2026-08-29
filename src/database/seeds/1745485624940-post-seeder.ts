import { PostEntity } from '@/api/post/entities/post.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
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
    const userRepository = dataSource.getRepository(UserEntity);
    const adminUser = await userRepository.findOneBy({
      username: 'admin',
    });
    if (!adminUser) {
      console.log('admin user not found, skipping post seeding');
      return;
    }

    const repository = dataSource.getRepository(PostEntity);
    const existingPost = await repository.findOneBy({ title: 'Post 1' });
    if (!existingPost) {
      await repository.insert(
        new PostEntity({
          title: 'Post 1',
          slug: 'post-1',
          content: 'Content 1',
          userId: adminUser.id,
          createdBy: SYSTEM_USER_ID,
          updatedBy: SYSTEM_USER_ID,
        }),
      );
    }
    console.log('seeding data');
    // Creating post by using factory
    const postFactory = factoryManager.get(PostEntity);
    await postFactory.saveMany(5, { userId: adminUser.id });
    console.log('Seed data success');
  }
}
