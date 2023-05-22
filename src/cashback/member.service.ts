import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AxiosResponse } from 'axios';

@Injectable()
export class MemberService {
  constructor(private httpService: HttpService) {}

  //getmember
  public async getmemberbyuser(
    username: string,
  ): Promise<AxiosResponse | object> {
    const url = `${process.env.ALL_MEMBER_API}/${username}`;
    const result = await this.httpService
      .get(url, { headers: { Authorization: `Bearer ${this.getToken()}` } })
      .toPromise();
    if (!result) throw new NotFoundException(['กรุณากรอก Username ให้ถุกต้อง']);
    else return result;
  }

  //getCreditmember
  public async getCurrentCredit(username) {
    let response = await this.getcredits(username);
    return response;
  }
  private async getcredits(username): Promise<AxiosResponse> {
    const url = `${process.env.API_GET_CREDIT}/${username}`;
    const result = await this.httpService
      .get(url, { headers: { Authorization: `Bearer ${this.getToken()}` } })
      .toPromise();

    if (result.status == 200) {
      return result;
    } else {
      throw new NotFoundException();
    }
  }

  getToken() {
    let token;
    return token;
  }
}
