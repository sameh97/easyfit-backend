import { injectable } from "inversify";
import { MemberDto } from "../../models/dto/member-dto";
import { Member } from "../../models/member";
import { AppUtils } from "../app-utils";

@injectable()
export class MemberDtoMapper {
  public asDto(member: Member): MemberDto {
    if (!AppUtils.hasValue(member)) {
      return null;
    }

    return {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      birthDay: member.birthDay,
      email: member.email,
      address: member.address,
      isActive: member.isActive,
      joinDate: member.joinDate,
      imageURL: member.imageURL,
      //gymId: member.gymId
    } as MemberDto;
  }

  public asEntity(memberDto: MemberDto): Member {
    if (!AppUtils.hasValue(memberDto)) {
      return null;
    }

    return {
      id: memberDto.id,
      firstName: memberDto.firstName,
      lastName: memberDto.lastName,
      birthDay: memberDto.birthDay,
      email: memberDto.email,
      address: memberDto.address,
      isActive: memberDto.isActive,
      joinDate: memberDto.joinDate,
      imageURL: memberDto.imageURL,
      phone: memberDto.phone,
      gymId: memberDto.gymId,
    } as Member;
  }
}
