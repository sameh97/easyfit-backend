import { inject, injectable } from "inversify";
import { Transaction } from "sequelize/types";
import { AppUtils } from "../common/app-utils";
import { Logger } from "../common/logger";
import { MemberAllReadyExist } from "../exeptions/member-exeptions/member-allready-exist";
import { Member } from "../models/member";

@injectable()
export class MembersRepository {
  constructor(@inject(Logger) private logger: Logger) {}

  public async getAll(gymId: number): Promise<Member[]> {
    return await Member.findAll({ where: { gymId: gymId } });
  }

  public async save(
    member: Member,
    transaction?: Transaction
  ): Promise<Member> {
    const memberInDB = await Member.findOne({
      where: { email: member.email },
      transaction: transaction,
    });

    if (AppUtils.hasValue(memberInDB)) {
      throw new MemberAllReadyExist(
        `member with email ${memberInDB.email} allready exist`
      );
    }

    this.logger.info(`Creating member with email '${member.email}'`);

    const createdMember = await Member.create(member, {
      transaction: transaction,
    });

    this.logger.info(`created member ${JSON.stringify(createdMember)}`);

    return createdMember;
  }
}
