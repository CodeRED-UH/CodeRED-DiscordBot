import { google } from "googleapis";
import "dotenv/config";
import { JWT, GaxiosResponse } from "googleapis-common";
// import { RequestManager } from "@discordjs/rest";
// import { sheets } from "googleapis/build/src/apis/sheets";

const page = "BotSheet";

class GoogleService {
  static async getData(range: string): Promise<GaxiosResponse> {
    const sheet = google.sheets("v4");
    const sheetdata = await sheet.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLESHEETID,
      auth: this.auth(),
      range: page + "!" + range,
    });
    return sheetdata;
  }

  static async linearSearch(key: string, range: string): Promise<number[]> {
    const sheetdata = await this.getData(range);

    if (sheetdata.data.values === undefined) return [-1];

    const rownum = sheetdata.data.values.length;
    const indexArray = [];
    for (let i = 0; i < rownum; i++) {
      const cell = sheetdata.data.values.at(i).at(0);
      if (cell === key) {
        indexArray.push(i + 1);
      }
    }
    return indexArray;
  }

  static async updateRange(range: string, values: string[][]) {
    const sheet = google.sheets("v4");
    sheet.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLESHEETID,
      auth: this.auth(),
      range: page + "!" + range,
      valueInputOption: "RAW",
      requestBody: { values },
    });
    return;
  }

  static async updateCell(cell: string, value: string) {
    await this.updateRange(cell, [[value]]);
    return;
  }

  static auth(): JWT {
    let str = process.env.GOOGLESCOPE;
    if (str === undefined) str = "";
    const scope = [str];
    const auth = new google.auth.JWT({
      email: process.env.GOOGLEEMAIL,
      key: process.env.GOOGLEKEY,
      scopes: scope,
    });
    return auth;
  }
}

export default GoogleService;
