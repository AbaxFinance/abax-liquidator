import { Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_ } from 'typeorm';
import * as marshal from './marshal';
import { Owner } from './owner.model';

//@ts-ignore
@Entity_()
export class Transfer {
  constructor(props?: Partial<Transfer>) {
    Object.assign(this, props);
  }

  //@ts-ignore
  @PrimaryColumn_('uuid')
  id!: string;

  //@ts-ignore
  @Index_()
  //@ts-ignore
  @ManyToOne_(() => Owner, { nullable: true })
  from!: Owner | undefined | null;

  //@ts-ignore
  @Index_()
  //@ts-ignore
  @ManyToOne_(() => Owner, { nullable: true })
  to!: Owner | undefined | null;

  //@ts-ignore
  @Column_('numeric', { transformer: marshal.bigintTransformer, nullable: false })
  amount!: bigint;

  //@ts-ignore
  @Column_('timestamp with time zone', { nullable: false })
  timestamp!: Date;

  //@ts-ignore
  @Column_('int4', { nullable: false })
  block!: number;

  //@ts-ignore
  @Column_('text', { nullable: false })
  extrinsicHash!: string;
}
