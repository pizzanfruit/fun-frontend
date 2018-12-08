export default class Player {
  public name: string = "";
  constructor(id?: string, name?: string) {
    this.name = name || "Pepper bot";
  }
}
