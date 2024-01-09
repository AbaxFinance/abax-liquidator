import { Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_ } from 'typeorm';
import * as marshal from './marshal';

//@ts-ignore
@Entity_()
export class Owner {
  constructor(props?: Partial<Owner>) {
    Object.assign(this, props);
  }

  //@ts-ignore
  @PrimaryColumn_()
  id!: string;

  //@ts-ignore
  @Column_('numeric', { transformer: marshal.bigintTransformer, nullable: false })
  balance!: bigint;
}
