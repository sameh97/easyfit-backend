import { inject, injectable } from "inversify";
import { Json } from "sequelize/types/lib/utils";
import { MemberDtoMapper } from "../common/dto-mapper/member-dto-mapper";
import { Logger } from "../common/logger";
import { MemberDto } from "../models/dto/member-dto";
import { Member } from "../models/member";
import { MembersService } from "../services/members-service";

@injectable()
export class MemebrsController {
  constructor(
    @inject(MembersService) private membersService: MembersService,
    @inject(MemberDtoMapper) private membersDtoMapper: MemberDtoMapper,
    @inject(Logger) private logger: Logger
  ) {}

  public getAll = async (req: any, res: any, next: any) => {
    try {
      const members: Member[] = await this.membersService.getAll(
        req.query.gymId
      );

      const memberDto: MemberDto[] = members.map((member) =>
        this.membersDtoMapper.asDto(member)
      );

      // next(memberDto);
      res.send(memberDto);
    } catch (err) {
      this.logger.error(`cannot get all members`, err);
      next(err);
    }
  };

  public createMember = async (req: any, res: any, next: any) => {
    let memberToCreate: Member = null;
    try {
      memberToCreate = this.membersDtoMapper.asEntity(req.body);

      const createdMember: Member = await this.membersService.create(
        memberToCreate
      );

      res.status(201);

      next(this.membersDtoMapper.asDto(createdMember));
    } catch (err) {
      this.logger.error(
        `Cannot create member ${JSON.stringify(memberToCreate)}`,
        err
      );
      next(err);
    }
  };
}
