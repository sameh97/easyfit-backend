import { inject, injectable } from "inversify";
import { Transaction } from "sequelize/types";
import { AppUtils } from "../common/app-utils";
import { Logger } from "../common/logger";
import { TempUrl } from "../models/temp-url";
import { TempUrlRepository } from "../repositories/temp-url-repository";
import { AppDBConnection } from "./../config/database";
import { v4 as uuidv4 } from "uuid";
import { Catalog } from "../models/catalog";
import { Product } from "../models/product";
import { ProductsRepository } from "../repositories/products-repository";
import { NotFound } from "../exeptions/notFound-exeption";
import { OutOfDateError } from "../exeptions/out-of-date-error";
import { parse } from "node-html-parser";
import { catalogTemplate } from "./easyfit-catalog-template";
import { catalogNotFoundTemplate } from "../templates/catalog-not-found-template";
import { catalogOutOfDateTemplate } from "../templates/catalog-out-of-date";
const nodemailer = require("nodemailer");
const wbm = require("wbm");

require("dotenv").config(); // TODO : remove

@injectable()
export class TempUrlService {
  constructor(
    @inject(TempUrlRepository) private tempUrlRepository: TempUrlRepository,
    @inject(Logger) private logger: Logger,
    @inject(AppDBConnection) private appDBConnection: AppDBConnection,
    @inject(ProductsRepository) private productsRepository: ProductsRepository
  ) {}

  public async create(tempUrl: TempUrl): Promise<TempUrl> {
    let transaction: Transaction = null;
    try {
      transaction = await this.appDBConnection.createTransaction();

      tempUrl.uuid = uuidv4();

      const createdTempUrl = await this.tempUrlRepository.save(
        tempUrl,
        transaction
      );

      await transaction.commit();

      this.logger.info(
        `created Temporary URL with uuid  ${createdTempUrl.uuid}`
      );

      return createdTempUrl;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      this.logger.error(
        `Error occurred while creating Temporary URL: error: ${AppUtils.getFullException(
          err
        )}`
      );
      throw err;
    }
  }

  public async getAll(gymId: number): Promise<TempUrl[]> {
    const tempUrls: TempUrl[] = await this.tempUrlRepository.getAll(gymId);
    for (let url of tempUrls) {
      const productsFromDB: Product[] = await this.getCatalogProductsByUUID(
        url.uuid
      );

      url.products = productsFromDB;
    }

    this.logger.info(`Returning ${tempUrls.length} Temporary URL's`);
    return tempUrls;
  }

  public async getByUUID(uuid: string): Promise<Product[]> {
    try {
      const tempUrl: TempUrl = await this.tempUrlRepository.getByUUID(uuid);

      if (!AppUtils.hasValue(tempUrl)) {
        throw new NotFound(`Catalog URL is not found`);
      }

      let dateNow: Date = new Date();

      let endDate: Date = AppUtils.addDays(
        tempUrl.createdAt,
        tempUrl.durationDays
      );

      if (dateNow.getTime() > endDate.getTime()) {
        throw new OutOfDateError(`Catalog is no longer available`);
      }

      // const catalog: Catalog[] = await Catalog.findAll({
      //   where: { tempUrlID: uuid },
      // });

      // let productIDS: number[] = [];

      // for (let item of catalog) {
      //   productIDS.push(item.productID);
      // }

      const products: Product[] = await this.getCatalogProductsByUUID(uuid);

      this.logger.info(`Returning Temporary URL ${tempUrl.uuid}`);
      return products;
    } catch (err) {
      this.logger.error(
        `Error occurred while getting Temporary URL: error: ${AppUtils.getFullException(
          err
        )}`,
        err
      );
      throw err;
    }
  }

  private getCatalogProductsByUUID = async (
    uuid: string
  ): Promise<Product[]> => {
    const catalog: Catalog[] = await Catalog.findAll({
      where: { tempUrlID: uuid },
    });

    let productIDS: number[] = [];

    for (let item of catalog) {
      productIDS.push(item.productID);
    }

    const products: Product[] = await this.productsRepository.getByIDs(
      productIDS
    );

    return products;
  };

  public buildCatalogOutOfDateHtml = async (): Promise<string> => {
    const root = parse(catalogOutOfDateTemplate);

    return root.toString();
  };

  public buildCatalogNotFoundHtml = async (): Promise<string> => {
    const root = parse(catalogNotFoundTemplate);

    return root.toString();
  };

  public buildHtml = async (products: Product[]): Promise<string> => {
    const root = parse(catalogTemplate);

    for (let product of products) {
      const name = product.name;
      const pro = parse(`<li>name:${name} <br> code: ${product.code}</li>`);
      root.querySelector("#easyfit-catalog-container").appendChild(pro);
    }
    return root.toString();
  };

  public update = async (tempUrl: TempUrl): Promise<TempUrl> => {
    let transaction: Transaction = null;
    try {
      transaction = await this.appDBConnection.createTransaction();

      const updatedTempUrl: TempUrl = await this.tempUrlRepository.update(
        tempUrl,
        transaction
      );

      await transaction.commit();


      this.logger.info(
        `updated Temporary URL with uuid ${updatedTempUrl.uuid}`
      );

      return updatedTempUrl;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      this.logger.error(
        `Error occurred while updating Temporary URL: error: ${AppUtils.getFullException(
          err
        )}`,
        err
      );
      throw err;
    }
  };

  public delete = async (uuid: string): Promise<void> => {
    let transaction: Transaction = null;
    try {
      this.logger.info(`Deleting Temporary URL with uuid ${uuid}`);

      transaction = await this.appDBConnection.createTransaction();

      await this.tempUrlRepository.delete(uuid, transaction);

      await transaction.commit();

      this.logger.info(`Temporary URL with uuid ${uuid} has been deleted.`);
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      throw err;
    }
  };

  public sendMail = async (mail: any): Promise<any> => {
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: mail.userEmail,
        pass: process.env.EMAIL_PASS,
      },
    });
    // "samehhhh66@outlook.com, khalilmahmod788@gmail.com"
    const mailOptions = {
      from: mail.userEmail,
      to: mail.emails,
      subject: "Invoices due",
      text: `Dudes, we really need your money. ${mail.link}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        return info.response;
      }
    });
  };

  public sendWhatsApp = async (details: any): Promise<any> => {
    wbm
      .start({ showBrowser: true, qrCodeData: true, session: false })
      .then(async (qrCodeData) => {
        const phones = details.phones;
        const message = details.message;
        // `Check out the Sales on ${details.gymName}: ${details.link}`
        await wbm.waitQRCode();
        const send = await wbm.send(phones, message);
        await wbm.end();

        return send;
      })
      .catch((err) => {
        this.logger.error(
          `Error occurred while sending whatsApp: error: ${AppUtils.getFullException(
            err
          )}`,
          err
        );
        throw err;
      });
  };
}
