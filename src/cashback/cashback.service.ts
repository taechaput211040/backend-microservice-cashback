import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashbackMembers } from './entity/CashbackMembers';
import { CashBacks } from './entity/CashBacks';
import { UpdateCashback } from './input/update.cashback.dto';
import { MemberService } from './member.service';
import { AxiosResponse } from 'axios';
import { CashbackRecievedRecords } from './entity/CashbackRecievedRecords';
import dayjs from 'dayjs';
var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
@Injectable()
export class CashbackService {
  constructor(
    private readonly memberService: MemberService,
    private readonly httpService: HttpService,
  ) {}
  @InjectRepository(CashBacks)
  private readonly CashBacks_repo: Repository<CashBacks>;
  @InjectRepository(CashbackMembers)
  private readonly CashbackMembers_repo: Repository<CashbackMembers>;
  @InjectRepository(CashbackRecievedRecords)
  private readonly CashbackRecievedRecords_repo: Repository<CashbackRecievedRecords>;

  //get cashback
  private async getCashback(): Promise<CashBacks> {
    return await this.CashBacks_repo.createQueryBuilder('t').getOne();
  }

  //current cashback setting
  public async getCurrentCashback(): Promise<CashBacks> {
    const response = await this.CashBacks_repo.findOne({
      where: [{ status: true }],
    });
    if (response) return response;
    else throw new BadRequestException(['Cashback ยังไม่เปิดใช้งาน']);
  }

  //tougle Cashback
  public async tougle() {
    const cash_backsCurrent = await this.getCashback();
    cash_backsCurrent.status = cash_backsCurrent.status == 0 ? 1 : 0;
    let result = await this.CashBacks_repo.save({
      ...cash_backsCurrent,
    });
    return result;
  }

  //tougle Cashback Type
  public async tougleType() {
    const cash_backsCurrent = await this.getCashback();
    cash_backsCurrent.cashback_type = !cash_backsCurrent.cashback_type;
    // console.log(cash_backsCurrent.cashback_type);
    let result = await this.CashBacks_repo.save({
      ...cash_backsCurrent,
    });
    return result;
  }

  //update Setting
  public async updateSetting(input: UpdateCashback): Promise<CashBacks> {
    const cash_backsCurrent = await this.getCashback();
    if (!cash_backsCurrent) {
      throw new NotFoundException();
    } else {
      let result = await this.CashBacks_repo.save({
        ...cash_backsCurrent,
        ...input,
      });
      return result;
    }
  }

  //CashbackMember
  public async getCashbackMember(username): Promise<CashbackMembers> {
    const result = await this.CashbackMembers_repo.findOne({
      where: [{ username: username }],
    });
    if (!result) {
      throw new BadRequestException([
        `ไม่พบข้อมูลของ ${username} กรุณากรอก Username ให้ถูกต้อง!!`,
      ]);
    } else {
      return result;
    }
  }

  //getdate
  public getDateFormatting(typeDate) {
    let start: any;
    let end: any;
    if (typeDate === 'day') {
      start = dayjs(new Date().setDate(new Date().getDate() - 1))
        .startOf('day')
        .format();
      end = dayjs(new Date().setDate(new Date().getDate() - 1))
        .endOf('day')
        .format();
    } else if (typeDate === 'week') {
      let beforeOneWeek = new Date(
        new Date().getTime() - 60 * 60 * 24 * 7 * 1000,
      );
      let day = beforeOneWeek.getDay();
      let diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1);
      start = dayjs(new Date(beforeOneWeek.setDate(diffToMonday)))
        .startOf('day')
        .format();
      end = dayjs(new Date(beforeOneWeek.setDate(diffToMonday + 6)))
        .endOf('day')
        .format();
    } else if (typeDate === 'month') {
      start = dayjs(
        new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      ).format();
      end = dayjs(
        new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      ).format();
    }

    return { start: start, end: end };
  }

  //dposit and withdraw
  private async getdeposit(
    username: string,
    member_cb,
    cb_setting,
  ): Promise<AxiosResponse | number> {
    let url: string;
    const typeDate = cb_setting.collectType.toLowerCase();

    if (cb_setting.cashback_type) {
      let dateFilter = this.getDateFormatting(typeDate);
      url = `${process.env.GET_ALL_DEPOSET_API}/${username}?start=${dateFilter.start}&end=${dateFilter.end}`;
    } else {
      url = `${process.env.GET_ALL_DEPOSET_API}/${username}?created_at=${member_cb.startCalTime}`;
    }

    let result = await this.httpService.get(url).toPromise();

    // result = result?.amount?.reduce((initVal, item) => {
    //   return (initVal += item.amount);
    // }, 0);

    return result ?? 0;
  }

  private async getWithdraw(
    username: string,
    member_cb,
    cb_setting,
  ): Promise<AxiosResponse | number> {
    let url: string;
    const typeDate = cb_setting.collectType.toLowerCase();

    if (cb_setting.cashback_type) {
      let dateFilter = this.getDateFormatting(typeDate);
      url = `${process.env.GET_ALL_WITHDRAW_API}/${username}?start=${dateFilter.start}&end=${dateFilter.end}`;
    } else {
      url = `${process.env.GET_ALL_WITHDRAW_API}/${username}?created_at=${member_cb.startCalTime}`;
    }

    let result = await this.httpService.get(url).toPromise();

    // }, 0);
    return result ?? 0;
  }

  //calculateCB
  public async calculateCashback(username: string): Promise<object> {
    const cb_setting = await this.getCashback();
    const member_cb = await this.getCashbackMember(username);
    const deposit = await this.getdeposit(username, member_cb, cb_setting);
    const withdraw = await this.getWithdraw(username, member_cb, cb_setting);
    const winlose = Number(deposit) - Number(withdraw);
    if (winlose < 0) {
      //ถ้า memberติดลบ (คนเล่นถอนมากกว้าฝาก)
      member_cb.cbCollectable = 0;
      await this.CashbackMembers_repo.save({
        ...member_cb,
      });
      let result = {
        cashback: 0,
        deposit: deposit,
        withdraw: withdraw,
        winlose: winlose,
        start_caltime: member_cb.startCalTime,
      };
      return result;
    }
    const setting = await this.getCashback();
    let cashback = (winlose * setting.rate) / 100;
    //cal ตาม rate ทัี่ตั้งไว้
    if (setting.maxAmount > 0) {
      if (cashback >= setting.maxAmount) {
        cashback = setting.maxAmount;
      }
    }
    member_cb.cbCollectable = cashback;
    await this.CashbackMembers_repo.save({
      ...member_cb,
    });
    let result = {
      cashback: cashback,
      deposit: deposit,
      withdraw: withdraw,
      winlose: winlose,
      start_caltime: member_cb.startCalTime,
    };
    return result;
  }

  //checkCashback
  public async checkCashback(username: string): Promise<object> {
    const cb_current = await this.getCashback();

    if (cb_current.status == false) {
      throw new BadRequestException(['Cashback ปิดใช้งานชั่วคราว']);
    }

    let member = await this.memberService.getmemberbyuser(username);
    if (!member) {
      throw new UnprocessableEntityException(['ไม่พบ username']);
    }
    if (Number(await this.memberService.getCurrentCredit(username)) >= 10) {
      throw new BadRequestException([
        'เครดิตปัจจุบันต้องน้อยกว่า 10 เครดิต เพื่อตรวจสอบยอดเงินคืน',
      ]);
    }

    if (await this.getCashbackMember(username)) {
      let resultCalculate = this.calculateCashback(username);
      let data_old = 10; //mock data   //resultCalculate.cashback
      return {
        cashback: data_old,
        data: resultCalculate,
        cb_status: true,
      };
    } else {
      await this.createCashBack(username);
      let resultCalculate = this.calculateCashback(username);
      let data_old = 10; //resultCalculate.cashback
      return {
        cashback: data_old,
        data: resultCalculate,
        cb_status: true,
      };
    }
  }

  //createCashback by user when use first time
  async createCashBack(username): Promise<CashbackMembers> {
    const cb_setting = await this.getCashback();
    const member_cb = new CashbackMembers();
    member_cb.username = username;
    member_cb.startCalTime = cb_setting.updatedAt;
    return await this.CashbackMembers_repo.save(member_cb);
  }

  //collect Cashback
  private async getCashBackRecived(username) {
    let response = await this.CashbackRecievedRecords_repo.findOne({
      where: [{ username: username }],
    });
    if (response) return response;
    else throw new NotFoundException(['ไม่พบข้อมูลของ Username นี้']);
  }

  public chaeckValidDate(typeDate) {
    const today = new Date();

    if (typeDate === 'day') {
      return true;
    } else if (typeDate === 'week') {
      if (dayjs(new Date(today)).day() == 1) {
        return true;
      }
    } else if (typeDate === 'month') {
      if (dayjs(new Date(today)).date() == 1) {
        return true;
      }
    }
  }
  public async collectCashback(username) {
    let member = await this.memberService.getmemberbyuser(username);
    if (await this.getCashBackRecived(username)) {
      return {
        credit: await this.memberService.getCurrentCredit(username),
        cashback: 0,
        cb_status: false,
        message: 'วันนี้คุณรับไปแล้ว กรุณารอรอบต่อไป',
      };
    }
    if (!member) {
      throw new UnprocessableEntityException(['ไม่พบ username']);
    }
    if (Number(await this.memberService.getCurrentCredit(username)) >= 10) {
      throw new BadRequestException([
        'เครดิตปัจจุบันต้องน้อยกว่า 10 เครดิต เพื่อตรวจสอบยอดเงินคืน',
      ]);
    }
    let cashbackMember = await this.getCashbackMember(username);
    if (cashbackMember) {
      let data_old = this.calculateCashback(username);
      const cashback = 10;
      //data_old.cashback //
      const member = await this.memberService.getmemberbyuser(username);
      const cb_setting = await this.getCashback();
      const typeDate = cb_setting.collectType.toLowerCase();
      let result: any = null;
      if (typeDate === 'day') {
        if (this.chaeckValidDate(typeDate)) {
          result = await this.topupCashBack(member, cashback, cb_setting);
        }
      } else if (typeDate === 'week') {
        //week
        if (this.chaeckValidDate(typeDate)) {
          result = await this.topupCashBack(member, cashback, cb_setting);
        } else {
          throw new BadRequestException([
            'รับเครดิตเงินคืนได้เฉพาะ วันจันทร์ เวลา 00.00 - 23.59 น. เท่านั้น',
          ]);
        }
      } else if (typeDate === 'month') {
        //month
        if (this.chaeckValidDate(typeDate)) {
          result = await this.topupCashBack(member, cashback, cb_setting);
        } else {
          throw new BadRequestException([
            'รับเครดิตเงินคืนได้เฉพาะวันแรกของเดือน เวลา 00.00 - 23.59 น. เท่านั้น',
          ]);
        }
      }
      if (result) {
        await this.saveTransactionCashback(member, cashback);
        return result;
      }
    } else {
      await this.createCashBack(username);
      let data_old = this.calculateCashback(username);
      let cashback = 10; //data_old.cashback
      await this.saveTransactionCashback(username, cashback);
      return {
        cashback: cashback,
        cb_status: true,
      };
    }
  }

  //save report transaction cashback to poom
  public async saveTransactionCashback(
    member,
    cashback,
  ): Promise<AxiosResponse<any>> {
    let url = `${process.env.API_SAVE_CASHBACK_TRANSACTION}`;
    return await this.httpService
      .post(url, { member: member, cashback: cashback })
      .toPromise();
  }

  //tobup ccashback
  public async topupCashBack(member, cashback, cb_setting) {
    let resdata = await this.topupAPISafe(member, cashback, cb_setting);
    if (await this.topupValidate(resdata)) {
      // await this.putturnBypass(member, cashback, cb_setting);
      // await this.saveDplistsBypass(member, resdata, cashback, 'AUTO');
      const cb_collectReport = new CashbackRecievedRecords();
      cb_collectReport.username = member.username;
      cb_collectReport.cbRecieve = cashback;
      await this.CashbackRecievedRecords_repo.save(cb_collectReport);

      const member_cb = await this.getCashbackMember(member.username);
      member_cb.startCalTime = cb_collectReport.createdAt;
      member_cb.lastCollectTime = cb_collectReport.createdAt;
      member_cb.cbCollectable = 0;
      member_cb.collectCount = member_cb.collectCount + 1;
      await this.CashbackMembers_repo.save({
        ...member_cb,
      });

      return {
        cashback: 0,
        credit: cashback,
        message: `รับเครดิตเงินคืนจำนวน ${cashback} เครดิต สำเร็จ`,
      };
    } else {
      throw new UnprocessableEntityException([
        'เครดิตเอเย่น ไม่พอต่อการเติม กรุณาติดต่อผู้ดูแลระบบ',
      ]);
    }
  }
  async saveDplistsBypass(member, resdata, cashback, operator: string) {
    let url = `${process.env.API_SAVE_DEPOSIT_LIST_BYPASS}`;
    const result = await this.httpService
      .put(url, {
        member: member,
        resdata: resdata,
        cashback: cashback,
        operator: operator,
      })
      .toPromise();
    if (result) return result;
    else throw new BadRequestException('Method not implemented.');
  }
  async putturnBypass(member, cashback, cb_setting) {
    let url = `${process.env.API_URL_SET_TURN_MEMBER}`;
    const result = await this.httpService
      .put(url, { member: member, cashback: cashback, cb_setting: cb_setting })
      .toPromise();
    if (result) return result;
    else throw new BadRequestException('Method not implemented.');
  }
  //validateTopup
  public async topupValidate(resdata) {
    if (resdata.message == 'success') {
      return true;
    } else {
      return false;
    }
  }
  //topupAPISafe
  public async topupAPISafe(member, cashback, credit = null) {
    if (!credit) {
      const currentcredit = await this.memberService.getCurrentCredit(
        member.username,
      );
      // if (currentcredit.message == 'failed') {
      //   credit = 0;
      // } else {
      //   credit = currentcredit.credit;
      // }
    }
    let url = process.env.API_URL_DEPOSIT_SAFE;
    let response = this.httpService
      .post(
        url,
        { member: member.member_uuid, amount: cashback },
        {
          headers: {
            Authorization: `Bearer ${this.memberService.getToken()}`,
          },
        },
      )
      .toPromise();
    // response.result.before_balance = Number(credit);
    // response.result.after_balance = Number(credit) + Number(cashback);
    return response;
  }
}
