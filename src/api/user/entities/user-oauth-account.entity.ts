import { UserEntity } from '@/api/user/entities/user.entity';
import { OAuthProviders } from '@/constants/entity.enum';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('user_oauth_account')
export class UserOauthAccountEntity extends AbstractEntity {
  constructor(data?: Partial<UserOauthAccountEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryColumn({
    type: 'enum',
    enum: OAuthProviders,
  })
  provider!: OAuthProviders;

  @ManyToOne(() => UserEntity, (user) => user.oAuthAccounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity | null;

  @PrimaryColumn({
    name: 'provider_account_id',
  })
  providerAccountId!: string;
}
