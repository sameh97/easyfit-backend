import { inject, injectable } from "inversify";
import { Transaction } from "sequelize/types";
import { AppUtils } from "../common/app-utils";
import { Logger } from "../common/logger";
import { AlreadyExistError } from "../exeptions/already-exist-error";
import { NotFoundErr } from "../exeptions/not-found-error";
import { Member } from "../models/member";

@injectable()
export class MembersRepository {
  constructor(@inject(Logger) private logger: Logger) {}

  public async getAll(gymId: number): Promise<Member[]> {
    return await Member.findAll({ where: { gymId: gymId } });
  }

  public async save(member: Member,transaction?: Transaction): Promise<Member> {
    const memberInDB = await Member.findOne({
      where: { email: member.email },
      transaction: transaction,
    });

    if (AppUtils.hasValue(memberInDB)) {
      throw new AlreadyExistError(
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

  public async getAllMales(gymId : number,transaction?:Transaction):Promise<any> {
    return await Member.count({
      where : {gymId : gymId, gender : 1},
      transaction : transaction
    });
  }


  public async getAllFemales(gymId : number, transaction?:Transaction):Promise<any> {
    return await Member.count({
      where : {gymId : gymId, gender : 2},
      transaction : transaction
    });
  }

  public async getPerMonth(gymId : number,transaction?:Transaction,):Promise<any> {
    return await Member.findAll({ where: { gymId: gymId } ,
      transaction : transaction
    });
  }

 

  public update = async (member: Member, transaction?: Transaction): Promise<Member> => {
    let memberInDB = await Member.findOne({
      where: { email: member.email },
      transaction: transaction,
    });

    if (!AppUtils.hasValue(memberInDB)) {
      throw new NotFoundErr(`member with email ${member.email} was not fount`);
    }

    this.logger.info(`Updating member with email '${member.email}'`);

    const updatedMember = await memberInDB.update(member);

    this.logger.info(`Updated member '${JSON.stringify(updatedMember)}'`);

    return updatedMember;
  };

  public delete = async ( id: number, transaction?: Transaction): Promise<void> => {
    const toDelete: Member = await Member.findOne({
      where: { id: id },
      transaction: transaction,
    });

    if (!AppUtils.hasValue(toDelete)) {
      throw new NotFoundErr(
        `Cannot delete member: ${id} because it is not found`
      );
    }

    await Member.destroy({
      where: { id: id },
      transaction: transaction,
    });
  };

  public getAllPhones = async (gymId: number,transaction?: Transaction): Promise<any[]> => {
    return await Member.findAll({
      attributes: ["phone"],
      where: { gymId: gymId },
      transaction: transaction,
    });
  };
}
