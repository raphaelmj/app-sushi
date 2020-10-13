import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "stripTags",
})
export class StripTagsPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return value.replace(/(<([^>]+)>)/gi, "").replace(/&nbsp;/g, " ");
  }
}
