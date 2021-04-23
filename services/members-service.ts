import { inject, injectable } from "inversify";
import { Transaction } from "sequelize/types";
import { now } from "sequelize/types/lib/utils";
import { AppUtils } from "../common/app-utils";
import { Logger } from "../common/logger";
import { InputError } from "../exeptions/input-error";
import { Member } from "../models/member";
import { MembersRepository } from "../repositories/members-repository";
import { AppDBConnection } from "./../config/database";

@injectable()
export class MembersService {
  constructor(
    @inject(MembersRepository) private memberRepository: MembersRepository,
    @inject(Logger) private logger: Logger,
    @inject(AppDBConnection) private appDBConnection: AppDBConnection
  ) {}

  public async create(member: Member): Promise<Member> {
    let transaction: Transaction = null;
    try {
      transaction = await this.appDBConnection.createTransaction();

      member.isActive = false;

      const createdMember = await this.memberRepository.save(
        member,
        transaction
      );

      await transaction.commit();

      this.logger.info(`created member with id ${createdMember.id}`);

      return createdMember;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      this.logger.error(
        `Error occurred while creating member: error: ${AppUtils.getFullException(
          err
        )}`
      );
      throw err;
    }
  }

  public async getAll(gymId: number): Promise<Member[]> {
    const members = await this.memberRepository.getAll(gymId);
    this.logger.info(`Returning ${members.length} members`);
    return members;
  }

  public update = async (member: Member): Promise<Member> => {
    let transaction: Transaction = null;
    try {
      transaction = await this.appDBConnection.createTransaction();

      const updatedMember = await this.memberRepository.update(
        member,
        transaction
      );

      await transaction.commit();

      this.logger.info(`updated member with email ${updatedMember.email}`);

      return updatedMember;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      this.logger.error(
        `Error occurred while updating member: error: ${AppUtils.getFullException(
          err
        )}`, err
      );
      throw err;
    }
  };

  public delete = async (id: number): Promise<void> => {
    if (!AppUtils.isInteger(id)) {
      throw new InputError(`Cannot delete member, the id must be an integer`);
    }

    let transaction: Transaction = null;
    try {
      this.logger.info(`Deleting member with id: ${id}`);

      transaction = await this.appDBConnection.createTransaction();

      await this.memberRepository.delete(id, transaction);

      await transaction.commit();

      this.logger.info(`Member with id ${id} has been deleted.`);
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      throw err;
    }
  };
}
