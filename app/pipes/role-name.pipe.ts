import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "roleName",
})
export class RoleNamePipe implements PipeTransform {
  loginTypesMap: Map<string, string> = new Map([
    ["waiter", "Kelnerka"],
    ["admin", "Kuchnia"],
  ]);

  transform(value: "admin" | "waiter", ...args: unknown[]): string {
    return this.loginTypesMap.get(value);
  }
}
