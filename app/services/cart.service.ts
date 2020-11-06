import { BonusSetConfigComponent } from './../tools/bonus-set-config/bonus-set-config.component';
import { CalculateService } from './calculate/calculate.service';
import { ConfirmPasswordType, PasswordConfirmComponent } from './../tools/password-confirm/password-confirm.component';
import { ReservationDataComponent } from './../tools/reservation-data/reservation-data.component';
import { ElementConfigStepsPrice, MenuElement } from './../models/menu-element';
import { DatePosition, BonusType } from './../models/cart-order';
import { QuickStatsComponent } from './../tools/quick-stats/quick-stats.component';
import { QuickStats } from './../models/quick-stats';
import { OrderActionType, CartOrder } from '~/models/cart-order';
import { ReservationSizeComponent } from './../tools/reservation-size/reservation-size.component';
import { ReservationModalComponent } from './../tools/reservation-modal/reservation-modal.component';
import { AppConfig } from '~/models/app-config';
import { ConfigStepOptionsComponent } from './../tools/config-step-options/config-step-options.component';
import { PlusElementConfigComponent } from './../tools/plus-element-config/plus-element-config.component';
import { CartCategory } from '~/models/cart-category';
import { FullOptionsGroup } from './../models/full-options-group';
import { PriceConfigSort } from './../models/price-config-sort';
import { StepOptionsComponent } from './../tools/step-options/step-options.component';
import { DescOptions } from './../models/desc-options';
import { StringOptionsSelectComponent } from './../tools/string-options-select/string-options-select.component';
import { ReverseOptions } from './../models/reverse-options';
import { ElementOptionType, SiteElement, ElementPrice, ElementMenuType } from './../models/site';
import { QuantityModalComponent } from './../tools/quantity-modal/quantity-modal.component';
import { ModalDialogService } from '@nativescript/angular';
import { ModalDialogOptions } from '@nativescript/angular';
import { Injectable, ViewContainerRef } from "@angular/core";
import { CartGroup, CartElement, PlusElement, StepOptionsListElement } from "~/models/cart-element";
import BigNumber from "bignumber.js"
import * as moment from "moment";
import { ConfigStepOptionsManyComponent } from '~/tools/config-step-options-many/config-step-options-many.component';
require("moment-precise-range-plugin");

@Injectable()
export class CartService {
  constructor(private modalService: ModalDialogService, private calculateService: CalculateService) { }

  createCartGroups(cart: CartElement[], anchors: CartCategory[]): CartGroup[] {
    var groups: CartGroup[] = [];

    anchors.map((a) => {
      var g: CartGroup = {
        type: a,
        elements: [],
      };
      cart.map((el) => {
        if (a.alias == el.type.alias) {
          g.elements.push(el);
        }
      });

      groups.push(g);
    });

    return groups;
  }

  findElementIndex(cart: CartElement[], cartEl: CartElement): number {
    var index;
    cart.map((cel, i) => {
      if (cel.ind) {
        if (cel.ind.id == cartEl.ind.id && cel.ind.index == cartEl.ind.index) {
          index = i;
        }
      }
    });
    return index;
  }

  findElementIndexById(cart: CartElement[], cartEl: CartElement): number {
    var index;
    cart.map((cel, i) => {
      if (cel.id == cartEl.id) {
        index = i;
      }
    });
    return index;
  }

  findGroupIndex(groups: CartGroup[], cartEl: CartElement): number {
    var index;
    groups.map((g, i) => {
      if (g.type.alias == cartEl.type.alias) {
        index = i;
      }
    });
    return index;
  }

  findGroupElementIndex(group: CartGroup, cartEl: CartElement) {
    var index;
    group.elements.map((cel, i) => {
      if (cel.ind) {
        if (cel.ind.id == cartEl.ind.id && cel.ind.index == cartEl.ind.index) {
          index = i;
        }
      }
    });
    return index;
  }

  findOptionsByType(element: MenuElement, index: number | null): string[] {
    switch (element.elementType) {
      case ElementMenuType.oneName:

        return element.options

        break;

      case ElementMenuType.manyNames:

        return element.priceNames[index].options

        break;

      case ElementMenuType.descElements:

        return element.descElements[index].options

        break;

      case ElementMenuType.configPrice:

        return element.options

        break

      case ElementMenuType.configStepsPriceMany:

        return element.options

        break

      case ElementMenuType.configStepsPriceMany:

        return element.options

        break
    }
  }

  createCartElement(element: MenuElement, options: FullOptionsGroup, type: CartCategory): CartElement {

    var opt: FullOptionsGroup = options
    var index = opt.index
    var ps: Array<string | number> = []
    options.plusElements.map((pe) => {
      ps.push(pe.price)
    });
    var plusPrice: number = this.calculateService.pricePlusMapElements(0, ps)

    switch (element.elementType) {
      case "one_name":

        var cartEl: CartElement = {
          ind: { id: element.id, index: opt.index, priceNameIndex: opt.index, configFirstIndex: null, configSecondIndex: null, configThirdIndex: null },
          elementType: element.elementType,
          quantity: opt.quantity,
          gluten: (element.onlyGluten) ? 0 : opt.gluten,
          grill: (element.onlyGrill) ? opt.quantity : opt.grill,
          canGrill: element.canGrill,
          onlyGrill: element.onlyGrill,
          hasGluten: element.hasGluten,
          onlyGluten: element.onlyGluten,
          canExtra: element.canExtra,
          canPack: element.canPack,
          isSea: opt.isSea,
          element,
          optionsElements: opt.optionsElements,
          descElements: opt.descElements,
          plusElements: opt.plusElements,
          reverseElements: opt.reverseElements,
          stepOptionsList: opt.stepOptionsList,
          elastic: (opt.quantity > 1) ? false : element.elastic,
          viewName: element.name,
          shortName: element.shortName,
          price: this.calculateService.plusElements(this.calculateService.multipleValues(element.price[opt.index].price, opt.quantity), plusPrice),
          pricePerOne: this.calculateService.stringToNumber(element.price[opt.index].price),
          description: opt.description,
          type,
          status: false,
          extra: opt.extra,
          serveType: opt.serveType,
          canOnePlate: element.canOnePlate,
          onOnePlate: opt.onOnePlate,
          canAcc: element.canAcc,
          acc: opt.acc,
        };

        break;
      case "many_names":
        var cartEl: CartElement = {
          ind: { id: element.id, index: opt.index, priceNameIndex: opt.index, configFirstIndex: null, configSecondIndex: null, configThirdIndex: null },
          elementType: element.elementType,
          quantity: opt.quantity,
          gluten: (element.onlyGluten) ? 0 : opt.gluten,
          grill: (element.onlyGrill) ? opt.quantity : opt.grill,
          canGrill: element.canGrill,
          onlyGrill: element.onlyGrill,
          hasGluten: element.hasGluten,
          onlyGluten: element.onlyGluten,
          canExtra: element.canExtra,
          canPack: element.canPack,
          isSea: opt.isSea,
          element,
          optionsElements: opt.optionsElements,
          descElements: opt.descElements,
          plusElements: opt.plusElements,
          reverseElements: opt.reverseElements,
          stepOptionsList: opt.stepOptionsList,
          elastic: (opt.quantity > 1) ? false : element.elastic,
          viewName: element.priceNames[index].name,
          shortName: element.priceNames[index].shortName,
          price: this.calculateService.plusElements(this.calculateService.multipleValues(element.priceNames[index].price[0].price, opt.quantity), plusPrice),
          pricePerOne: this.calculateService.stringToNumber(element.priceNames[index].price[0].price),
          description: opt.description,
          type,
          status: false,
          extra: opt.extra,
          serveType: opt.serveType,
          canOnePlate: element.canOnePlate,
          onOnePlate: opt.onOnePlate,
          canAcc: element.canAcc,
          acc: opt.acc,
        };

        break;
      case "desc_elements":
        // console.log(element.descElements[index], opt.isSea)

        var p: string = opt.isSea ? element.descElements[index].seaPrice : element.descElements[index].price;

        var cartEl: CartElement = {
          ind: { id: element.id, index: opt.index, priceNameIndex: opt.index, configFirstIndex: null, configSecondIndex: null, configThirdIndex: null },
          elementType: element.elementType,
          quantity: opt.quantity,
          gluten: (element.onlyGluten) ? 0 : opt.gluten,
          grill: (element.onlyGrill) ? opt.quantity : opt.grill,
          canGrill: element.canGrill,
          onlyGrill: element.onlyGrill,
          hasGluten: element.hasGluten,
          onlyGluten: element.onlyGluten,
          canExtra: element.canExtra,
          canPack: element.canPack,
          isSea: opt.isSea,
          element,
          optionsElements: opt.optionsElements,
          descElements: opt.descElements,
          plusElements: opt.plusElements,
          reverseElements: opt.reverseElements,
          stepOptionsList: opt.stepOptionsList,
          elastic: (opt.quantity > 1) ? false : element.elastic,
          viewName: element.name + " - " + element.descElements[index].info,
          shortName: element.shortName + ":" + element.descElements[index].shortName,
          price: this.calculateService.plusElements(this.calculateService.multipleValues(p, opt.quantity), plusPrice),
          pricePerOne: this.calculateService.stringToNumber(p),
          description: opt.description,
          type,
          status: false,
          extra: opt.extra,
          serveType: opt.serveType,
          canOnePlate: element.canOnePlate,
          onOnePlate: opt.onOnePlate,
          canAcc: element.canAcc,
          acc: opt.acc,
        };

        break;
      case "config_price":
        var cartEl: CartElement = {
          ind: { id: element.id, index: opt.index, priceNameIndex: opt.index, configFirstIndex: null, configSecondIndex: null, configThirdIndex: null },
          elementType: element.elementType,
          quantity: opt.quantity,
          gluten: (element.onlyGluten) ? 0 : opt.gluten,
          grill: (element.onlyGrill) ? opt.quantity : opt.grill,
          canGrill: element.canGrill,
          onlyGrill: element.onlyGrill,
          hasGluten: element.hasGluten,
          onlyGluten: element.onlyGluten,
          canExtra: element.canExtra,
          canPack: element.canPack,
          isSea: opt.isSea,
          element,
          optionsElements: opt.optionsElements,
          descElements: opt.descElements,
          plusElements: opt.plusElements,
          reverseElements: opt.reverseElements,
          stepOptionsList: opt.stepOptionsList,
          elastic: (opt.quantity > 1) ? false : element.elastic,
          viewName: element.name + " " + element.price[index].perSize + " szt.",
          shortName: element.shortName + "/" + element.price[index].perSize + " szt.",
          price: this.calculateService.plusElements(this.calculateService.multipleValues(element.price[index].price, opt.quantity), plusPrice),
          pricePerOne: this.calculateService.stringToNumber(element.price[index].price),
          description: opt.description,
          type,
          status: false,
          extra: opt.extra,
          serveType: opt.serveType,
          canOnePlate: element.canOnePlate,
          onOnePlate: opt.onOnePlate,
          canAcc: element.canAcc,
          acc: opt.acc,
        };

        break;

      case "config_steps_price":

        var ppo: string = element.configStepsPrice[opt.configFirstIndex].types[opt.configSecondIndex].options[opt.configThirdIndex].price
        var viewName = element.name + " >> " + element.configStepsPrice[opt.configFirstIndex].name + " >> " + element.configStepsPrice[opt.configFirstIndex].types[opt.configSecondIndex].type + " >> " + element.configStepsPrice[opt.configFirstIndex].types[opt.configSecondIndex].options[opt.configThirdIndex].name
        var shortName = element.shortName + ">>" + element.configStepsPrice[opt.configFirstIndex].shortName + ">>" + element.configStepsPrice[opt.configFirstIndex].types[opt.configSecondIndex].type + ">>" + element.configStepsPrice[opt.configFirstIndex].types[opt.configSecondIndex].options[opt.configThirdIndex].shortName

        var cartEl: CartElement = {
          ind: { id: element.id, index: opt.index, priceNameIndex: opt.index, configFirstIndex: opt.configFirstIndex, configSecondIndex: opt.configSecondIndex, configThirdIndex: opt.configThirdIndex },
          elementType: element.elementType,
          quantity: opt.quantity,
          gluten: (element.onlyGluten) ? 0 : opt.gluten,
          grill: (element.onlyGrill) ? opt.quantity : opt.grill,
          canGrill: element.canGrill,
          onlyGrill: element.onlyGrill,
          hasGluten: element.hasGluten,
          onlyGluten: element.onlyGluten,
          canExtra: element.canExtra,
          canPack: element.canPack,
          isSea: opt.isSea,
          element,
          optionsElements: opt.optionsElements,
          descElements: opt.descElements,
          plusElements: opt.plusElements,
          reverseElements: opt.reverseElements,
          stepOptionsList: opt.stepOptionsList,
          elastic: (opt.quantity > 1) ? false : element.elastic,
          viewName,
          shortName,
          price: this.calculateService.plusElements(this.calculateService.multipleValues(ppo, opt.quantity), plusPrice),
          pricePerOne: this.calculateService.stringToNumber(ppo),
          description: opt.description,
          type,
          status: false,
          extra: opt.extra,
          serveType: opt.serveType,
          canOnePlate: element.canOnePlate,
          onOnePlate: opt.onOnePlate,
          canAcc: element.canAcc,
          acc: opt.acc,
        };
        break;

      case "config_steps_price_many":

        var price: number = this.findPriceFromStepOptionsList(opt.stepOptionsList, element.configStepsPrice)

        var cartEl: CartElement = {
          ind: { id: element.id, index: opt.index, priceNameIndex: opt.index, configFirstIndex: opt.configFirstIndex, configSecondIndex: opt.configSecondIndex, configThirdIndex: opt.configThirdIndex },
          elementType: element.elementType,
          quantity: opt.quantity,
          gluten: (element.onlyGluten) ? 0 : opt.gluten,
          grill: (element.onlyGrill) ? opt.quantity : opt.grill,
          canGrill: element.canGrill,
          onlyGrill: element.onlyGrill,
          hasGluten: element.hasGluten,
          onlyGluten: element.onlyGluten,
          canExtra: element.canExtra,
          canPack: element.canPack,
          isSea: opt.isSea,
          element,
          optionsElements: opt.optionsElements,
          descElements: opt.descElements,
          plusElements: opt.plusElements,
          reverseElements: opt.reverseElements,
          stepOptionsList: opt.stepOptionsList,
          elastic: element.elastic,
          viewName: element.name,
          shortName: element.shortName,
          price: this.calculateService.plusElements(price, plusPrice),
          pricePerOne: this.calculateService.stringToNumber(price),
          description: opt.description,
          type,
          status: false,
          extra: opt.extra,
          serveType: opt.serveType,
          canOnePlate: element.canOnePlate,
          onOnePlate: opt.onOnePlate,
          canAcc: element.canAcc,
          acc: opt.acc,
        }
        break

    }

    return cartEl;
  }


  createCartSpecialElement(data: FullOptionsGroup, categories: CartCategory[], price: string): CartElement {

    var type = null
    categories.map(c => {
      if (c.isSpecial) {
        type = c
      }
    })

    if (!type) {
      type = categories[categories.length - 1]
    }

    var cartEl: CartElement = {
      elementType: 'special',
      quantity: data.quantity,
      gluten: data.gluten,
      grill: data.grill,
      isSea: data.isSea,
      canExtra: false,
      serveType: data.serveType,
      optionsElements: data.optionsElements,
      descElements: data.descElements,
      plusElements: data.plusElements,
      reverseElements: data.reverseElements,
      elastic: true,
      viewName: "Specjalne",
      shortName: "Spec.",
      price: this.calculateService.multipleValues(price, data.quantity),
      pricePerOne: this.calculateService.stringToNumber(price),
      description: data.description,
      type,
      status: false,
      extra: 0,
      canGrill: true,
      hasGluten: true,
      canPack: true,
      canAcc: true,
      acc: data.acc
    };
    return cartEl
  }



  showInitOptionsPlusModal(
    element: MenuElement,
    index: number | null,
    priceNameIndex: number | null,
    dataOptions: { plusCartCategories: CartCategory[], elementOptions: { desc: DescOptions[]; reverse: ReverseOptions[] } },
    viewCRef: ViewContainerRef,
    appConfig: AppConfig,
    onOnePlate: boolean,
    orderActionType: OrderActionType
  ): Promise<FullOptionsGroup | boolean> {

    switch (element.optionsOnInit) {

      case "custom":
        if (element.elementType == ElementMenuType.configStepsPrice)
          return this.showModalConfigSteps(viewCRef, element, dataOptions, index, priceNameIndex, appConfig, onOnePlate, orderActionType)

        if (element.elementType == ElementMenuType.configStepsPriceMany)
          return this.showModalConfigStepsMany(viewCRef, element, dataOptions, index, priceNameIndex, appConfig, onOnePlate, orderActionType)

        return this.showModalSteps(viewCRef, element, dataOptions, index, priceNameIndex, appConfig, onOnePlate, orderActionType)
        break;

      case "all":

        if (element.elementType == ElementMenuType.configStepsPrice)
          return this.showModalConfigSteps(viewCRef, element, dataOptions, index, priceNameIndex, appConfig, onOnePlate, orderActionType)

        if (element.elementType == ElementMenuType.configStepsPriceMany)
          return this.showModalConfigStepsMany(viewCRef, element, dataOptions, index, priceNameIndex, appConfig, onOnePlate, orderActionType)

        return this.showModalSteps(viewCRef, element, dataOptions, index, priceNameIndex, appConfig, onOnePlate, orderActionType)
        break;

      case "select":

        if (element.elementType == ElementMenuType.configStepsPrice)
          return this.showModalConfigSteps(viewCRef, element, dataOptions, index, priceNameIndex, appConfig, onOnePlate, orderActionType)

        if (element.elementType == ElementMenuType.configStepsPriceMany)
          return this.showModalConfigStepsMany(viewCRef, element, dataOptions, index, priceNameIndex, appConfig, onOnePlate, orderActionType)

        return this.showModalSelect(viewCRef, element, index, priceNameIndex, appConfig, onOnePlate, orderActionType)
        break

      default:

        if (element.elementType == ElementMenuType.configStepsPrice)
          return this.showModalConfigSteps(viewCRef, element, dataOptions, index, priceNameIndex, appConfig, onOnePlate, orderActionType)

        if (element.elementType == ElementMenuType.configStepsPriceMany)
          return this.showModalConfigStepsMany(viewCRef, element, dataOptions, index, priceNameIndex, appConfig, onOnePlate, orderActionType)

        return this.showModalQuantity(viewCRef, element, index, priceNameIndex, appConfig, onOnePlate, orderActionType)
        break
    }

  }

  showModalConfigSteps(
    viewCRef: ViewContainerRef,
    element: MenuElement,
    dataOptions: { plusCartCategories: CartCategory[], elementOptions: { desc: DescOptions[]; reverse: ReverseOptions[] } },
    index: number | null,
    priceNameIndex: number | null,
    appConfig: AppConfig,
    onOnePlate: boolean,
    orderActionType: OrderActionType): Promise<FullOptionsGroup | boolean> {
    var options: ModalDialogOptions = {
      context: {
        element: element,
        elementOptions: dataOptions.elementOptions,
        index,
        priceNameIndex,
        cartPlusCategories: dataOptions.plusCartCategories,
        appConfig,
        onOnePlate,
        orderActionType
      },
      viewContainerRef: viewCRef,
      fullscreen: true,
    };
    return this.modalService.showModal(ConfigStepOptionsComponent, options);
  }

  showModalConfigStepsMany(
    viewCRef: ViewContainerRef,
    element: MenuElement,
    dataOptions: { plusCartCategories: CartCategory[], elementOptions: { desc: DescOptions[]; reverse: ReverseOptions[] } },
    index: number | null,
    priceNameIndex: number | null,
    appConfig: AppConfig,
    onOnePlate: boolean,
    orderActionType: OrderActionType): Promise<FullOptionsGroup | boolean> {
    var options: ModalDialogOptions = {
      context: {
        element: element,
        elementOptions: dataOptions.elementOptions,
        index,
        priceNameIndex,
        cartPlusCategories: dataOptions.plusCartCategories,
        appConfig,
        onOnePlate,
        orderActionType
      },
      viewContainerRef: viewCRef,
      fullscreen: true,
    };
    return this.modalService.showModal(ConfigStepOptionsManyComponent, options);
  }

  showModalSteps(
    viewCRef: ViewContainerRef,
    element: MenuElement,
    dataOptions: { plusCartCategories: CartCategory[], elementOptions: { desc: DescOptions[]; reverse: ReverseOptions[] } },
    index: number | null,
    priceNameIndex: number | null,
    appConfig: AppConfig,
    onOnePlate: boolean,
    orderActionType: OrderActionType): Promise<FullOptionsGroup | boolean> {
    var options: ModalDialogOptions = {
      context: {
        element: element,
        elementOptions: dataOptions.elementOptions,
        index,
        priceNameIndex,
        cartPlusCategories: dataOptions.plusCartCategories,
        appConfig,
        onOnePlate,
        orderActionType
      },
      viewContainerRef: viewCRef,
      fullscreen: true,
    };
    return this.modalService.showModal(StepOptionsComponent, options);
  }

  showModalQuantity(
    viewCRef: ViewContainerRef,
    element: MenuElement,
    index: number | null,
    priceNameIndex: number | null,
    appConfig: AppConfig,
    onOnePlate: boolean,
    orderActionType: OrderActionType): Promise<FullOptionsGroup | boolean> {
    var options: ModalDialogOptions = {
      context: {
        element: element,
        index,
        priceNameIndex,
        appConfig,
        onOnePlate,
        orderActionType
      },
      viewContainerRef: viewCRef,
      fullscreen: false,
    };
    return this.modalService.showModal(QuantityModalComponent, options);
  }

  showModalSelect(
    viewCRef: ViewContainerRef,
    element: MenuElement,
    index: number | null,
    priceNameIndex: number | null,
    appConfig: AppConfig,
    onOnePlate: boolean,
    orderActionType: OrderActionType): Promise<FullOptionsGroup | boolean> {
    var options: ModalDialogOptions = {
      context: {
        element: element,
        options: element.options,
        index,
        priceNameIndex,
        appConfig,
        onOnePlate,
        orderActionType
      },
      viewContainerRef: viewCRef,
      fullscreen: false,
    };
    return this.modalService.showModal(StringOptionsSelectComponent, options);
  }




  showModalConfigPlus(
    viewCRef: ViewContainerRef,
    element: MenuElement,
    index: number | null,
    priceNameIndex: number | null,
    appConfig: AppConfig,
    onOnePlate: boolean,
    orderActionType: OrderActionType): Promise<PlusElement | boolean> {
    var options: ModalDialogOptions = options = {
      context: {
        element: element,
        index,
        priceNameIndex,
        appConfig,
        onOnePlate,
        orderActionType
      },
      viewContainerRef: viewCRef,
      fullscreen: true,
    };
    return this.modalService.showModal(PlusElementConfigComponent, options);
  }


  showModalReservation(viewCRef: ViewContainerRef, readyDate: Date, data: { description: string, forWho: string, phone: string, reservationSize: number }, isOnCart: boolean = true, isCreate: boolean = true): Promise<any> {
    var options: ModalDialogOptions = options = {
      context: {
        readyDate,
        data,
        isOnCart
      },
      viewContainerRef: viewCRef,
      fullscreen: true,
    };
    return this.modalService.showModal(ReservationModalComponent, options);
  }


  showModalReservationSize(viewCRef: ViewContainerRef, reservationSize: number): Promise<boolean | number> {
    var options: ModalDialogOptions = options = {
      context: {
        reservationSize
      },
      viewContainerRef: viewCRef,
      fullscreen: true,
    };
    return this.modalService.showModal(ReservationSizeComponent, options);
  }

  showModalReservationData(viewCRef: ViewContainerRef, data: { description: string, forWho: string, phone: string, reservationSize: number }, noSize: boolean = false): Promise<boolean | { description: string, forWho: string, reservationSize: number }> {
    var options: ModalDialogOptions = options = {
      context: {
        data,
        noSize
      },
      viewContainerRef: viewCRef,
      fullscreen: true,
    };
    return this.modalService.showModal(ReservationDataComponent, options);
  }

  showModalBonusConfig(viewCRef: ViewContainerRef, total: number | string, appConfig: AppConfig, bonusType: BonusType, currentBonusPrice: number, currentBonusPercent: number): Promise<boolean> {
    var options: ModalDialogOptions = options = {
      context: {
        total,
        appConfig,
        bonusType,
        currentBonusPrice,
        currentBonusPercent
      },
      viewContainerRef: viewCRef,
      fullscreen: true,
    };
    return this.modalService.showModal(BonusSetConfigComponent, options);
  }


  showModalCheckSomePassword(viewCRef: ViewContainerRef, type: ConfirmPasswordType = ConfirmPasswordType.imageCode): Promise<boolean> {
    var options: ModalDialogOptions = options = {
      context: {
        type
      },
      viewContainerRef: viewCRef,
      fullscreen: false,
    };
    return this.modalService.showModal(PasswordConfirmComponent, options);
  }


  preparePriceConfigArray(price: ElementPrice[]): PriceConfigSort[] {
    var pConfig: PriceConfigSort[] = [];
    // arraySort(price, 'perSize')
    price.forEach((element, i) => {
      var isPer = false;

      pConfig.map((cel, j) => {
        if (cel.perSize == element.perSize) {
          isPer = true;
          pConfig[j].data.push({
            price: element.price,
            isSea: element.isSea,
            indexInElement: i,
          });
        }
      });

      if (!isPer) {
        var firstElement = [
          {
            price: element.price,
            isSea: element.isSea,
            indexInElement: i,
          },
        ];
        pConfig.push({
          perSize: element.perSize,
          data: firstElement,
        });

        // console.log(pConfig)
      }
    });

    return pConfig;
  }


  createName(
    menuElement: MenuElement,
    index: number | null,
    priceNameIndex: number | null,
    configFirstIndex: number | null = null,
    configSecondIndex: number | null = null,
    configThirdIndex: number | null = null,
    optionsElements: string[]): string {
    let step: StepOptionsListElement

    switch (menuElement.elementType) {
      case ElementMenuType.oneName:
        return menuElement.name
        break
      case ElementMenuType.manyNames:
        return menuElement.priceNames[index].name
        break
      case ElementMenuType.configPrice:
        return menuElement.name
        break
      case ElementMenuType.descElements:
        return menuElement.descElements[index].info
        break
      case ElementMenuType.configStepsPrice:
        step = { configFirstIndex, configSecondIndex, configThirdIndex }
        return (this.createStepAllNames(step, menuElement)).shortName
        break
      case ElementMenuType.configStepsPriceMany:
        return menuElement.name
        break
      default:
        return menuElement.name
        break
    }
  }

  createShortName(
    menuElement: MenuElement,
    index: number | null,
    priceNameIndex: number | null,
    configFirstIndex: number | null = null,
    configSecondIndex: number | null = null,
    configThirdIndex: number | null = null,
    optionsElements: string[]
  ): string {
    let step: StepOptionsListElement
    switch (menuElement.elementType) {
      case ElementMenuType.oneName:
        return menuElement.shortName
        break
      case ElementMenuType.manyNames:
        return menuElement.priceNames[index].shortName

        break
      case ElementMenuType.configPrice:
        return menuElement.shortName
        break
      case ElementMenuType.descElements:
        return menuElement.shortName + ':' + menuElement.descElements[index].shortName
        break
      case ElementMenuType.configStepsPrice:
        step = { configFirstIndex, configSecondIndex, configThirdIndex }
        return (this.createStepAllNames(step, menuElement)).shortName
        break
      case ElementMenuType.configStepsPriceMany:
        return menuElement.shortName
        break
      default:
        return menuElement.shortName
        break
    }
  }

  showModalQuickStats(viewCRef: ViewContainerRef, date: Date, quickStats: QuickStats): Promise<any> {
    var options: ModalDialogOptions = options = {
      context: {
        date,
        quickStats
      },
      viewContainerRef: viewCRef,
      fullscreen: true
    };
    return this.modalService.showModal(QuickStatsComponent, options);
  }

  getOrderNumber(endDay: Date, currentDay: Date, order: CartOrder): string {
    var dPos: DatePosition = this.findDayPos(currentDay, endDay)
    var cD = moment(moment(currentDay).format('YYYY-MM-DD'));
    var oDay = moment(endDay)
    if (dPos == DatePosition.after) {
      var ob = moment.preciseDiff(cD, oDay, true)
      return order.orderNumber + "/+" + ob.days + "d"
    }

    if (dPos == DatePosition.before) {
      var ob = moment.preciseDiff(oDay, cD, true)
      return order.orderNumber + "/-" + ob.days + "d"
    }
    return String(order.orderNumber)
  }

  findDayPos(now: Date, endDay: Date): DatePosition {
    var currentDay = moment(moment().format('YYYY-MM-DD'));
    var orderDay = moment(endDay)
    var datePosition: DatePosition
    if (orderDay.isBefore(currentDay)) {
      datePosition = DatePosition.before
    } else if (orderDay.isAfter(currentDay)) {
      datePosition = DatePosition.after
    } else if (orderDay.isSame(currentDay)) {
      datePosition = DatePosition.now
    }
    return datePosition
  }

  findPriceFromStepOptionsList(stepOptionsList: StepOptionsListElement[], elementConfigStepsPrice: ElementConfigStepsPrice[]): number {
    var ps: Array<string | number> = []
    stepOptionsList.map((s: StepOptionsListElement) => {
      ps.push(elementConfigStepsPrice[s.configFirstIndex].types[s.configSecondIndex].options[s.configThirdIndex].price)
    })
    return this.calculateService.pricePlusMapElements(0, ps)
  }

  findPriceFromOneStepOptionsList(s: StepOptionsListElement, elementConfigStepsPrice: ElementConfigStepsPrice[]): number {
    return Number(elementConfigStepsPrice[s.configFirstIndex].types[s.configSecondIndex].options[s.configThirdIndex].price)
  }

  sumPlusElements(plusElements: PlusElement[]): number {
    var ps: Array<string | number> = []
    plusElements.map((plus) => {
      ps.push(plus.price)
    });
    return this.calculateService.pricePlusMapElements(0, ps)
  }

  createStepAllNames(opt: StepOptionsListElement, element: MenuElement): { viewName: string, shortName: string } {
    var viewName = element.name + " >> " + element.configStepsPrice[opt.configFirstIndex].name + " >> " + element.configStepsPrice[opt.configFirstIndex].types[opt.configSecondIndex].type + " >> " + element.configStepsPrice[opt.configFirstIndex].types[opt.configSecondIndex].options[opt.configThirdIndex].name
    var shortName = element.shortName + ">>" + element.configStepsPrice[opt.configFirstIndex].shortName + ">>" + element.configStepsPrice[opt.configFirstIndex].types[opt.configSecondIndex].type + ">>" + element.configStepsPrice[opt.configFirstIndex].types[opt.configSecondIndex].options[opt.configThirdIndex].shortName
    return { viewName, shortName }
  }

  calcPriceExceptPlusAndExtra(quantity: number, pricePerOne: number, oldPricePerOne: number, price: number) {
    var right: number = this.calculateService.multipleValues(quantity, oldPricePerOne)
    var div: number = this.calculateService.minusElements(price, right)
    var newPurePrice: number = this.calculateService.multipleValues(quantity, pricePerOne)
    return this.calculateService.plusElements(div, newPurePrice)

  }

}
