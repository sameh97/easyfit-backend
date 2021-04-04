import { inject, injectable } from "inversify";
import { Transaction } from "sequelize/types";
import { AppUtils } from "../common/app-utils";
import { Logger } from "../common/logger";
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
}
